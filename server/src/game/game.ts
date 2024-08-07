import { StateMachine } from '@/lib/state-machine'
import { deepExtend, range } from '@/utils/collections'
import { MyEvent } from '@/utils/events'
import { Logger } from '@/utils/log'
import { randomPassword } from '@/utils/password'
import { f } from '@/utils/string'
import { CardsLookupApi, GameProgress } from '@shared/cards'
import { ExpansionType } from '@shared/expansions/types'
import { GameInfo } from '@shared/extra'
import {
	GameState,
	GameStateValue,
	PlayerStateValue,
	ProgressMilestoneType
} from '@shared/game'
import {
	draftCard,
	pickCards,
	pickPreludes,
	playerPass,
	UpdateDeepPartial
} from '@shared/index'
import { MapType } from '@shared/map'
import { Maps } from '@shared/maps'
import { GameModes } from '@shared/modes'
import { GameModeType } from '@shared/modes/types'
import { PlayerActionType } from '@shared/player-actions'
import { ProgressMilestones } from '@shared/progress-milestones'
import { initialGameState } from '@shared/states'
import { isMarsTerraformed, shuffle } from '@shared/utils'
import { v4 as uuidv4 } from 'uuid'
import { Bot } from './bot'
import { BotNames } from './bot-names'
import { DraftGameState } from './game/draft-game-state'
import { EndedGameState } from './game/ended-game-state'
import { EndingTilesGameState } from './game/ending-tiles-game-state'
import { GenerationEndingState } from './game/generation-ending-state'
import { GenerationInProgressGameState } from './game/generation-in-progress-game-state'
import { GenerationStartGameState } from './game/generation-start-game-state'
import { PreludeGameState } from './game/prelude-game-state'
import { ResearchPhaseGameState } from './game/research-phase-game-state'
import { StartingGameState } from './game/starting-game-state'
import { WaitingForPlayersGameState } from './game/waiting-for-players-game-state'
import {
	CardPlayedEvent,
	Player,
	ProductionChangedEvent,
	ProjectBought,
	TilePlacedEvent
} from './player'
import { SolarPhaseGameState } from './game/solar-phase-game-state'

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

	fastBots: boolean
	fastProduction: boolean
}
export class Game {
	get logger() {
		const shortId =
			this.state.id.length > 5
				? this.state.id.slice(0, 2) + '..' + this.state.id.slice(-2)
				: this.state.id

		return new Logger(`Game(${shortId})`)
	}

	config: GameConfig

	state = initialGameState(uuidv4())

	currentProgress = {} as Record<GameProgress, number | undefined>

	players: Player[] = []

	onStateUpdated = new MyEvent<Readonly<GameState>>()
	onPlayerKicked = new MyEvent<Player>()

	sm = new StateMachine<GameStateValue>()

	botNames = shuffle([...BotNames])

	constructor(config?: Partial<GameConfig>) {
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
			fastProduction: false,
			draft: false,
			solarPhase: false,
			...config
		}

		this.state.map = Maps[this.config.map].build()
		this.state.name = this.config.name
		this.state.mode = this.config.mode
		this.state.draft = this.config.draft
		this.state.solarPhase = this.config.solarPhase
		this.state.expansions = [...this.config.expansions]

		range(0, this.config.bots).forEach(() => {
			this.add(new Bot(this, { fast: config?.fastBots }), false)
		})

		this.sm.onStateChanged.on(({ old, current }) => {
			if (!current.name) {
				throw new Error(`Game state without name!`)
			}

			this.logger.log(
				`${old && old.name ? GameStateValue[old.name] : 'NONE'} -> ${
					GameStateValue[current.name]
				}`
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
		const player = this.players.find(p => p.state.id === playerId)

		if (!player) {
			throw new Error(`Undefined player ${playerId}`)
		}

		return player
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

	load = (state: GameState) => {
		this.state = state
		this.players = []

		state.players.forEach(p => {
			const player = p.bot
				? new Bot(this, { fast: this.config.fastBots })
				: new Player(this)

			player.state = p

			this.logger.log(
				f('Player {0} session: {1}', player.name, player.state.session)
			)

			this.add(player, false)
		})

		this.sm.currentState = this.sm.findState(this.state.state)
		this.currentProgress = {} as Record<GameProgress, number | undefined>
	}

	updated = () => {
		this.checkState()

		if (this.sm.update()) {
			this.updated()
		} else {
			this.onStateUpdated.emit(this.state)
		}
	}

	add(player: Player, triggerUpdate = true) {
		if (this.players.find(p => p.id === player.id)) {
			throw new Error(`ID ${player.id} is not unique player id`)
		}

		if (
			!player.state.bot &&
			this.state.players.find(p => p.owner) === undefined
		) {
			player.state.owner = true
		}

		this.players.push(player)

		// Only add to state if not already present (eg - joining to saved game)
		if (!this.state.players.find(p => p.id === player.state.id)) {
			this.state.players.push(player.state)
		}

		player.onStateChanged.on(this.updated)

		// Dispatch passive events on player events
		player.onCardPlayed.on(this.handleCardPlayed)
		player.onTilePlaced.on(this.handleTilePlaced)
		player.onProjectBought.on(this.handleProjectBought)
		player.onProductionChanged.on(this.handlePlayerProductionChanged)

		this.logger.log(`Player ${player.name} (${player.id}) added to the game`)

		if (triggerUpdate) {
			this.updated()
		}
	}

	remove(player: Player) {
		this.players = this.players.filter(p => p !== player)
		this.state.players = this.state.players.filter(p => p !== player.state)

		this.logger.log(
			`Player ${player.name} (${player.id}) removed from the game`
		)

		player.onStateChanged.off(this.updated)
		this.onStateUpdated.emit(this.state)
	}

	handleGenerationEnd = () => {
		this.state.players.forEach(player => {
			player.usedCards
				.map(c => [c, CardsLookupApi.get(c.code)] as const)
				.forEach(([s, c]) => {
					c.passiveEffects.forEach(
						e =>
							e.onGenerationEnd &&
							e.onGenerationEnd({
								card: s,
								game: this.state,
								player: player
							})
					)
				})
		})
	}

	handleProjectBought = ({ player: playedBy, project }: ProjectBought) => {
		this.state.players.forEach(player => {
			player.usedCards
				.map(c => [c, CardsLookupApi.get(c.code)] as const)
				.forEach(([s, c]) => {
					c.passiveEffects.forEach(
						e =>
							e.onStandardProject &&
							e.onStandardProject(
								{
									card: s,
									game: this.state,
									player: player
								},
								project,
								playedBy.state
							)
					)
				})
		})
	}

	handleCardPlayed = ({
		player: playedBy,
		card,
		cardIndex: playedCardIndex
	}: CardPlayedEvent) => {
		this.state.players.forEach(player => {
			player.usedCards
				.map(c => [c, CardsLookupApi.get(c.code)] as const)
				.forEach(([s, c]) => {
					c.passiveEffects.forEach(
						e =>
							e.onCardPlayed &&
							e.onCardPlayed(
								{
									card: s,
									game: this.state,
									player: player
								},
								card,
								playedCardIndex,
								playedBy.state
							)
					)
				})
		})
	}

	handleNewGeneration = (generation: number) => {
		this.state.players.forEach(player => {
			player.usedCards
				.map(c => [c, CardsLookupApi.get(c.code)] as const)
				.forEach(([s, c]) => {
					c.passiveEffects.forEach(
						e =>
							e.onGenerationStarted &&
							e.onGenerationStarted(
								{
									card: s,
									game: this.state,
									player: player
								},
								generation
							)
					)
				})
		})
	}

	handleTilePlaced = ({ player: playedBy, cell }: TilePlacedEvent) => {
		this.state.players.forEach(player => {
			player.usedCards
				.map(c => [c, CardsLookupApi.get(c.code)] as const)
				.forEach(([s, c]) => {
					c.passiveEffects.forEach(
						e =>
							e.onTilePlaced &&
							e.onTilePlaced(
								{
									card: s,
									game: this.state,
									player: player
								},
								cell,
								playedBy.state
							)
					)
				})
		})
	}

	handlePlayerProductionChanged = ({
		player: playedBy,
		production,
		change
	}: ProductionChangedEvent) => {
		this.state.players.forEach(player => {
			player.usedCards
				.map(c => [c, CardsLookupApi.get(c.code)] as const)
				.forEach(([s, c]) => {
					c.passiveEffects.forEach(
						e =>
							e.onPlayerProductionChanged &&
							e.onPlayerProductionChanged(
								{
									card: s,
									game: this.state,
									player: player
								},
								playedBy.state,
								production,
								change
							)
					)
				})
		})
	}

	all(state: PlayerStateValue) {
		return this.state.players.every(p => p.state === state)
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
			'venus'
		] as const) {
			const value = this.state[progress]
			const lastValue = this.currentProgress[progress]

			if (lastValue !== undefined && lastValue !== value) {
				this.handleProgressChanged(progress)
			}

			this.currentProgress[progress] = value
		}
	}

	handleProgressChanged(progress: GameProgress) {
		this.state.players.forEach(player => {
			player.usedCards
				.map(c => [c, CardsLookupApi.get(c.code)] as const)
				.forEach(([s, c]) => {
					c.passiveEffects.forEach(
						e =>
							e.onProgress &&
							e.onProgress(
								{
									card: s,
									game: this.state,
									player: player
								},
								progress
							)
					)
				})
		})
	}

	/**
	 * Checks disconnected players and skips them if they're playing right now
	 */
	checkDisconnected() {
		if (!this.players.every(p => !p.state.connected || p.state.bot)) {
			// Make sure disconnected players are not stalling others
			this.players.forEach(p => {
				try {
					if (!p.state.connected) {
						if (p.state.state !== PlayerStateValue.Playing) {
							if (p.state.pendingActions.length > 0) {
								p.state.pendingActions.forEach(a => {
									if (a.type === PlayerActionType.PickStarting) {
										// Starting pick can stall others!
									}

									if (a.type === PlayerActionType.PickCards) {
										p.performAction(pickCards([]))
									}

									if (a.type === PlayerActionType.PickPreludes) {
										p.performAction(pickPreludes(range(0, a.limit)))
									}

									if (a.type === PlayerActionType.DraftCard) {
										p.performAction(draftCard([0]))
									}
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
		this.state.map.oxygenMilestones.forEach(m => {
			if (!m.used && m.value <= this.state.oxygen) {
				this.logger.log(
					`Oxygen milestone ${ProgressMilestoneType[m.type]} (at ${
						m.value
					}) reached`
				)

				m.used = true

				ProgressMilestones[m.type].effects.forEach(e =>
					e(this.state, this.currentPlayer)
				)
			}
		})

		this.state.map.temperatureMilestones.forEach(m => {
			if (!m.used && m.value <= this.state.temperature) {
				this.logger.log(
					`Temperature milestone ${ProgressMilestoneType[m.type]} (at ${
						m.value
					}) reached`
				)

				m.used = true

				ProgressMilestones[m.type].effects.forEach(e =>
					e(this.state, this.currentPlayer)
				)
			}
		})

		this.state.map.venusMilestones.forEach(m => {
			if (!m.used && m.value <= this.state.venus) {
				this.logger.log(
					`Venus milestone ${ProgressMilestoneType[m.type]} (at ${
						m.value
					}) reached`
				)

				m.used = true

				ProgressMilestones[m.type].effects.forEach(e =>
					e(this.state, this.currentPlayer)
				)
			}
		})
	}

	filterPendingActions() {
		this.players.forEach(p => {
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
			expansions: this.state.expansions.filter(e => e !== ExpansionType.Base),
			draft: this.state.draft
		}
	}
}
