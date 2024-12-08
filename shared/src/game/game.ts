import {
	CardCallbackContext,
	CardCategory,
	CardPassiveEffect,
	CardsLookupApi,
	GameProgress,
} from '@shared/cards'
import { ColoniesLookupApi } from '@shared/ColoniesLookupApi'
import { getRulingParty } from '@shared/expansions/turmoil/utils/getRulingParty'
import { ExpansionType } from '@shared/expansions/types'
import { GameInfo } from '@shared/extra'
import {
	GameState,
	GameStateValue,
	PlayerStateValue,
	ProgressMilestoneType,
	StandardProjectType,
} from '@shared/gameState'
import {
	draftCard,
	pickCards,
	pickPreludes,
	playerPass,
	solarPhaseTerraform,
	UpdateDeepPartial,
} from '@shared/index'
import { Logger } from '@shared/lib/logger'
import { StateMachine } from '@shared/lib/state-machine'
import { MapType } from '@shared/map'
import { Maps } from '@shared/maps'
import { GameModes } from '@shared/modes'
import { GameModeType } from '@shared/modes/types'
import { PlayerActionType } from '@shared/player-actions'
import { ProgressMilestones } from '@shared/progress-milestones'
import { initialGameState, initialStandardProjectState } from '@shared/states'
import { deepCopy, deepExtend } from '@shared/utils/collections'
import { MyEvent } from '@shared/utils/events'
import { f } from '@shared/utils/f'
import { isMarsTerraformed } from '@shared/utils/isMarsTerraformed'
import { randomPassword } from '@shared/utils/password'
import { range } from '@shared/utils/range'
import { shuffle } from '@shared/utils/shuffle'
import { v4 as uuidv4 } from 'uuid'
import { BotNames } from './bot-names'
import { Bot } from './bot/bot'
import { buildEvents } from './events/buildEvents'
import { GameEvent } from './events/eventTypes'
import { ColoniesProductionGameState } from './game/colonies-production-game-state'
import { DraftGameState } from './game/draft-game-state'
import { EndedGameState } from './game/ended-game-state'
import { EndingTilesGameState } from './game/ending-tiles-game-state'
import { GenerationEndingState } from './game/generation-ending-state'
import { GenerationInProgressGameState } from './game/generation-in-progress-game-state'
import { GenerationStartGameState } from './game/generation-start-game-state'
import { PreludeGameState } from './game/prelude-game-state'
import { ResearchPhaseGameState } from './game/research-phase-game-state'
import { SolarPhaseGameState } from './game/solar-phase-game-state'
import { StartingGameState } from './game/starting-game-state'
import { TurmoilGameState } from './game/turmoil-game-state'
import { WaitingForPlayersGameState } from './game/waiting-for-players-game-state'
import {
	BeforeColonyTradeEvent,
	CardBoughtEvent,
	ColonyBuiltEvent,
	Player,
	ProductionChangedEvent,
	ProjectBoughtEvent,
	TerraformingRatingChangedEvent,
	TilePlacedEvent,
} from './player'

export interface GameConfig {
	bots: number
	adminPassword: string
	mode: GameModeType
	map: MapType
	name: string
	public: boolean
	spectatorsAllowed: boolean
	expansions: ExpansionType[]
	draft: boolean
	solarPhase: boolean

	maxBots: number
	fastBots: boolean
	fastProduction: boolean
	instantBots: boolean
	debugBots: boolean

	everybodyIsAdmin: boolean
	/** Disable players (skip their turn) when they're disconnected for specified number of seconds */
	disablePlayersWhenDisconnectedForInSeconds?: number
}

export interface GameLockSystem {
	createLock: (state: GameState) => void
	clearLock: (id: string) => void
	tryLoadLock: (id: string) => GameState | null
}

export class Game {
	get logger() {
		const shortId =
			this.state.id.length > 5
				? this.state.id.slice(0, 2) + '..' + this.state.id.slice(-2)
				: this.state.id

		return this.baseLogger.duplicate(`Game(${shortId})`)
	}

	config: GameConfig

	state = initialGameState(uuidv4())

	currentProgress = {} as Record<GameProgress, number | undefined>

	players: Player[] = []

	onStateUpdated = new MyEvent<Readonly<GameState>>()
	onPlayerKicked = new MyEvent<Player>()

	sm = new StateMachine<GameStateValue>()

	botNames = shuffle([...BotNames])

	private lastGameState: GameState | null = null

	constructor(
		readonly lockSystem: GameLockSystem,
		readonly baseLogger: Logger,
		config?: Partial<GameConfig>,
	) {
		this.config = {
			bots: 0,
			adminPassword: randomPassword(10),
			mode: GameModeType.Standard,
			map: MapType.Standard,
			name: 'Standard game',
			public: false,
			spectatorsAllowed: true,
			expansions: [ExpansionType.Base, ExpansionType.Prelude],
			fastBots: false,
			debugBots: false,
			fastProduction: false,
			instantBots: false,
			draft: false,
			solarPhase: false,
			everybodyIsAdmin: false,
			disablePlayersWhenDisconnectedForInSeconds: 30,
			maxBots: 5,
			...config,
		}

		this.state.map = Maps[this.config.map].build()
		this.state.name = this.config.name
		this.state.mode = this.config.mode
		this.state.draft = this.config.draft
		this.state.solarPhase = this.config.solarPhase
		this.state.expansions = [...this.config.expansions]

		range(0, this.config.bots).forEach(() => {
			this.add(
				new Bot(this, {
					fast: config?.fastBots,
					debug: config?.debugBots,
					instant: config?.instantBots,
				}),
				false,
			)
		})

		this.sm.onStateChanged.on(({ old, current }) => {
			if (!current.name) {
				throw new Error(`Game state without name!`)
			}

			this.logger.log(
				`${old && old.name ? GameStateValue[old.name] : 'NONE'} -> ${
					GameStateValue[current.name]
				}`,
			)

			this.state.state = current.name
			this.updated()
		})

		this.sm
			.addState(new WaitingForPlayersGameState(this))
			.addState(new StartingGameState(this))
			.addState(new GenerationInProgressGameState(this))
			.addState(new GenerationStartGameState(this))
			.addState(new GenerationEndingState(this))
			.addState(new EndingTilesGameState(this))
			.addState(new EndedGameState(this))
			.addState(new ResearchPhaseGameState(this))
			.addState(new DraftGameState(this))
			.addState(new PreludeGameState(this))
			.addState(new SolarPhaseGameState(this))
			.addState(new ColoniesProductionGameState(this))
			.addState(new TurmoilGameState(this))

		this.sm.setState(GameStateValue.WaitingForPlayers)
	}

	get inProgress() {
		return this.state.state !== GameStateValue.WaitingForPlayers
	}

	get currentPlayer() {
		const player = this.state.players[this.state.currentPlayer]

		if (!player) {
			throw new Error(`Undefined player ${this.state.currentPlayer}`)
		}

		return player
	}

	get currentPlayerInstance() {
		const playerId = this.currentPlayer.id
		const player = this.players.find((p) => p.state.id === playerId)

		if (!player) {
			throw new Error(`Undefined player ${playerId}`)
		}

		return player
	}

	get bots() {
		return this.players.filter((p) => p.state.bot)
	}

	get mode() {
		return GameModes[this.state.mode]
	}

	get isMarsTerraformed() {
		return isMarsTerraformed(this.state)
	}

	pickBotName(id: number) {
		return this.botNames.pop() || `Bot ${id}`
	}

	load = (state: GameState, config: GameConfig) => {
		// Backwards compatibility with old format that didn't have project state
		if (typeof state.standardProjects[0] === 'number') {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			state.standardProjects = (state as any).standardProjects.map(
				(p: StandardProjectType) => initialStandardProjectState(p),
			)
		}

		for (const player of state.players) {
			if (
				typeof player.cardPriceChanges === 'undefined' &&
				'cardPriceChange' in player
			) {
				player.cardPriceChanges = [{ change: player.cardPriceChange as number }]
			}

			if (
				typeof player.tagPriceChanges === 'undefined' &&
				'tagPriceChange' in player
			) {
				player.tagPriceChanges = Object.entries(
					player.tagPriceChange as Record<CardCategory, number>,
				).map(([tag, change]) => ({
					change: change as number,
					tag: +tag as CardCategory,
				}))
			}
		}

		this.config = config

		this.state = state
		this.players = []

		state.players.forEach((p) => {
			const player = p.bot
				? new Bot(this, {
						fast: this.config.fastBots,
						debug: this.config.debugBots,
						instant: this.config.instantBots,
					})
				: new Player(this)

			player.state = p

			this.logger.log(
				f('Player {0} session: {1}', player.name, player.state.session),
			)

			this.add(player, false)
		})

		this.sm.currentState = this.sm.findState(this.state.state)
		this.currentProgress = {} as Record<GameProgress, number | undefined>
	}

	updated = () => {
		this.checkState()
		this.buildEventsAfterStateChange()

		if (this.sm.update()) {
			this.updated()
		} else {
			this.onStateUpdated.emit(this.state)
		}
	}

	buildEventsAfterStateChange() {
		if (this.lastGameState === null) {
			// TODO: Better cloning logic?
			this.lastGameState = deepCopy(this.state)
		} else {
			const events = buildEvents(this.lastGameState, this.state)

			this.state.events.push(...events)

			this.lastGameState = deepCopy(this.state)
		}
	}

	startEventsCollector() {
		const copy = deepCopy(this.state)

		return {
			startState: copy,
			collectAndPush: (
				build: (events: GameEvent[]) => Omit<GameEvent, 'at'>,
				{ markAsProcessed }: { markAsProcessed?: boolean } = {},
			) => {
				const collectedEvents = buildEvents(copy, this.state)

				if (markAsProcessed === undefined || markAsProcessed) {
					collectedEvents.forEach((event) => {
						event.processed = true
					})
				}

				this.state.events.push(
					{ at: Date.now(), ...build(collectedEvents) } as GameEvent,
					...collectedEvents,
				)

				this.lastGameState = deepCopy(this.state)

				return collectedEvents
			},
		}
	}

	pushEvent<TEvent extends Omit<GameEvent, 'at'>>(event: TEvent) {
		this.state.events.push({ at: Date.now(), ...event } as GameEvent)
		this.onStateUpdated.emit(this.state)
	}

	addBot() {
		this.add(
			new Bot(this, {
				fast: this.config.fastBots,
				instant: this.config.instantBots,
				debug: this.config.debugBots,
			}),
		)
	}

	add(player: Player, triggerUpdate = true) {
		if (this.players.find((p) => p.id === player.id)) {
			throw new Error(`ID ${player.id} is not unique player id`)
		}

		if (
			!player.state.bot &&
			this.state.players.find((p) => p.owner) === undefined
		) {
			player.state.owner = true
		}

		this.players.push(player)

		// Only add to state if not already present (eg - joining to saved game)
		if (!this.state.players.find((p) => p.id === player.state.id)) {
			this.state.players.push(player.state)
		}

		player.onStateChanged.on(this.updated)

		// Dispatch passive events on player events
		player.onCardBought.on(this.handleCardBought)
		player.onTilePlaced.on(this.handleTilePlaced)
		player.onProjectBought.on(this.handleProjectBought)
		player.onProductionChanged.on(this.handlePlayerProductionChanged)

		player.onTerraformingRatingChanged.on(
			this.handlePlayerTerraformingRatingChanged,
		)

		player.onBeforeColonyTrade.on(this.handleBeforeColonyTrade)
		player.onColonyBuilt.on(this.handleColonyBuilt)

		this.logger.log(`Player ${player.name} (${player.id}) added to the game`)

		if (triggerUpdate) {
			this.updated()
		}
	}

	triggerPassiveEffects = <TEffectKey extends keyof CardPassiveEffect>(
		effect: TEffectKey,
		args: NonNullable<CardPassiveEffect[TEffectKey]> extends (
			...args: [CardCallbackContext, ...infer TArgs]
		) => void
			? TArgs
			: never,
	) => {
		this.state.players.forEach((player) => {
			player.usedCards
				.map((c) => [c, CardsLookupApi.get(c.code)] as const)
				.forEach(([s, c]) => {
					c.passiveEffects.forEach(
						(e) =>
							typeof e[effect] === 'function' &&
							// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
							(e[effect] as Function).apply(null, [
								{
									card: s,
									game: this.state,
									player,
								},
								...args,
							]),
					)
				})
		})
	}

	handleColonyBuilt = (evt: ColonyBuiltEvent) => {
		this.triggerPassiveEffects('onColonyBuilt', [evt.player.state, evt.colony])
	}

	handleBeforeColonyTrade = (evt: BeforeColonyTradeEvent) => {
		this.state.players.forEach((player) => {
			player.usedCards
				.map((c) => [c, CardsLookupApi.get(c.code)] as const)
				.forEach(([s, c]) => {
					c.passiveEffects.forEach(
						(e) =>
							e.onBeforeColonyTrade &&
							e.onBeforeColonyTrade(
								{
									card: s,
									game: this.state,
									player,
								},
								evt.player.state,
								evt.colony,
							),
					)
				})
		})
	}

	remove(player: Player) {
		this.players = this.players.filter((p) => p !== player)
		this.state.players = this.state.players.filter((p) => p !== player.state)

		this.logger.log(
			`Player ${player.name} (${player.id}) removed from the game`,
		)

		player.onStateChanged.off(this.updated)
		this.onStateUpdated.emit(this.state)
	}

	handleGenerationEnd = () => {
		this.state.players.forEach((player) => {
			player.usedCards
				.map((c) => [c, CardsLookupApi.get(c.code)] as const)
				.forEach(([s, c]) => {
					c.passiveEffects.forEach(
						(e) =>
							e.onGenerationEnd &&
							e.onGenerationEnd({
								card: s,
								game: this.state,
								player: player,
							}),
					)
				})
		})
	}

	handleProjectBought = ({ player: playedBy, project }: ProjectBoughtEvent) => {
		this.state.players.forEach((player) => {
			player.usedCards
				.map((c) => [c, CardsLookupApi.get(c.code)] as const)
				.forEach(([s, c]) => {
					c.passiveEffects.forEach(
						(e) =>
							e.onStandardProject &&
							e.onStandardProject(
								{
									card: s,
									game: this.state,
									player: player,
								},
								project,
								playedBy.state,
							),
					)
				})
		})
	}

	handleCardBought = ({
		player: playedBy,
		card,
		cardIndex: playedCardIndex,
		moneyCost,
	}: CardBoughtEvent) => {
		this.state.players.forEach((player) => {
			player.usedCards
				.map((c) => [c, CardsLookupApi.get(c.code)] as const)
				.forEach(([s, c]) => {
					c.passiveEffects.forEach(
						(e) =>
							e.onCardBought &&
							e.onCardBought(
								{
									card: s,
									game: this.state,
									player: player,
								},
								card,
								playedCardIndex,
								playedBy.state,
								moneyCost,
							),
					)
				})
		})
	}

	handleNewGeneration = (generation: number) => {
		this.state.players.forEach((player) => {
			player.terraformRatingIncreasedThisGeneration = false

			player.usedCards
				.map((c) => [c, CardsLookupApi.get(c.code)] as const)
				.forEach(([s, c]) => {
					c.passiveEffects.forEach(
						(e) =>
							e.onGenerationStarted &&
							e.onGenerationStarted(
								{
									card: s,
									game: this.state,
									player: player,
								},
								generation,
							),
					)
				})
		})
	}

	handleTilePlaced = ({ player: playedBy, cell }: TilePlacedEvent) => {
		this.state.players.forEach((player) => {
			player.usedCards
				.map((c) => [c, CardsLookupApi.get(c.code)] as const)
				.forEach(([s, c]) => {
					c.passiveEffects.forEach(
						(e) =>
							e.onTilePlaced &&
							e.onTilePlaced(
								{
									card: s,
									game: this.state,
									player: player,
								},
								cell,
								playedBy.state,
							),
					)
				})
		})

		if (this.state.committee.enabled) {
			getRulingParty(this.state)?.policy.passive.forEach((p) => {
				p.onTilePlaced?.({ game: this.state, cell, player: playedBy.state })
			})
		}
	}

	handlePlayerProductionChanged = ({
		player: playedBy,
		production,
		change,
	}: ProductionChangedEvent) => {
		this.state.players.forEach((player) => {
			player.usedCards
				.map((c) => [c, CardsLookupApi.get(c.code)] as const)
				.forEach(([s, c]) => {
					c.passiveEffects.forEach(
						(e) =>
							e.onPlayerProductionChanged &&
							e.onPlayerProductionChanged(
								{
									card: s,
									game: this.state,
									player: player,
								},
								playedBy.state,
								production,
								change,
							),
					)
				})
		})
	}

	handlePlayerTerraformingRatingChanged = (
		event: TerraformingRatingChangedEvent,
	) => {
		if (this.state.committee.enabled) {
			getRulingParty(this.state)?.policy.passive.forEach((p) => {
				p.onPlayerRatingChanged?.({
					game: this.state,
					player: event.player.state,
				})
			})
		}
	}

	all(state: PlayerStateValue) {
		return this.state.players.every((p) => p.state === state)
	}

	checkState() {
		this.checkDisconnected()
		this.checkGameEvents()
	}

	checkGameEvents() {
		for (const progress of [
			'oxygen',
			'temperature',
			'oceans',
			'venus',
		] as const) {
			const value = this.state[progress]
			const lastValue = this.currentProgress[progress]

			if (lastValue !== undefined && lastValue !== value) {
				this.handleProgressChanged(progress)
			}

			this.currentProgress[progress] = value
		}

		for (const colony of this.state.colonies) {
			if (!colony.active) {
				ColoniesLookupApi.get(colony.code).activationCallback?.({
					game: this.state,
					colony,
				})
			}
		}
	}

	handleProgressChanged(progress: GameProgress) {
		this.state.players.forEach((player) => {
			player.usedCards
				.map((c) => [c, CardsLookupApi.get(c.code)] as const)
				.forEach(([s, c]) => {
					c.passiveEffects.forEach(
						(e) =>
							e.onProgress &&
							e.onProgress(
								{
									card: s,
									game: this.state,
									player: player,
								},
								progress,
							),
					)
				})
		})
	}

	/**
	 * Checks disconnected players and skips them if they're playing right now
	 */
	checkDisconnected() {
		if (!this.players.every((p) => !p.state.connected || p.state.bot)) {
			// Make sure disconnected players are not stalling others
			this.players.forEach((p) => {
				try {
					if (!p.state.connected) {
						if (p.state.state !== PlayerStateValue.Playing) {
							if (p.state.state === PlayerStateValue.SolarPhaseTerraform) {
								const availableProgressValues = (
									['oceans', 'temperature', 'oxygen'] as const
								).filter(
									(progress) => this.state[progress] < this.state.map[progress],
								)

								p.performAction(solarPhaseTerraform(availableProgressValues[0]))
							} else if (p.state.pendingActions.length > 0) {
								p.state.pendingActions.forEach((a) => {
									if (a.type === PlayerActionType.PickStarting) {
										// Starting pick can stall others!
									}

									if (a.type === PlayerActionType.PickCards) {
										p.performAction(pickCards([]))
									}

									if (a.type === PlayerActionType.PickPreludes) {
										p.performAction(pickPreludes(range(0, 2)))
									}

									if (a.type === PlayerActionType.DraftCard) {
										p.performAction(draftCard([0]))
									}

									// TODO: Tons of other actions here
								})
							}
						}

						if (
							p.id === this.currentPlayer.id &&
							(p.state.state === PlayerStateValue.Playing ||
								p.state.state === PlayerStateValue.EndingTiles)
						) {
							this.logger.log(`${p.name} is disconnected, passing`)
							p.performAction(playerPass())
						}
					}
				} catch (e) {
					this.logger.error(e)
				}
			})
		}
	}

	/**
	 * Checks if game passed any milestone
	 */
	checkMilestones() {
		this.state.map.oxygenMilestones.forEach((m) => {
			if (!m.used && m.value <= this.state.oxygen) {
				this.logger.log(
					`Oxygen milestone ${ProgressMilestoneType[m.type]} (at ${
						m.value
					}) reached`,
				)

				m.used = true

				ProgressMilestones[m.type].effects.forEach((e) =>
					e(this.state, this.currentPlayer),
				)
			}
		})

		this.state.map.temperatureMilestones.forEach((m) => {
			if (!m.used && m.value <= this.state.temperature) {
				this.logger.log(
					`Temperature milestone ${ProgressMilestoneType[m.type]} (at ${
						m.value
					}) reached`,
				)

				m.used = true

				ProgressMilestones[m.type].effects.forEach((e) =>
					e(this.state, this.currentPlayer),
				)
			}
		})

		this.state.map.venusMilestones.forEach((m) => {
			if (!m.used && m.value <= this.state.venus) {
				this.logger.log(
					`Venus milestone ${ProgressMilestoneType[m.type]} (at ${
						m.value
					}) reached`,
				)

				m.used = true

				ProgressMilestones[m.type].effects.forEach((e) =>
					e(this.state, this.currentPlayer),
				)
			}
		})
	}

	filterPendingActions() {
		this.players.forEach((p) => {
			p.filterPendingActions()
		})
	}

	adminChange(data: UpdateDeepPartial<GameState>) {
		deepExtend(this.state, data)
		this.updated()
	}

	info(): GameInfo {
		return {
			id: this.state.id,
			mode: this.state.mode,
			state: this.state.state,
			name: this.state.name,
			players: this.players.length,
			maxPlayers: this.state.maxPlayers,
			prelude: this.state.prelude,
			map: this.state.map.code,
			spectatorsEnabled: this.config.spectatorsAllowed,
			expansions: this.state.expansions.filter((e) => e !== ExpansionType.Base),
			draft: this.state.draft,
		}
	}
}
