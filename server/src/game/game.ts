import { StateMachine } from '@/lib/state-machine'
import { deepExtend, range } from '@/utils/collections'
import { Logger } from '@/utils/log'
import { randomPassword } from '@/utils/password'
import { f } from '@/utils/string'
import { CardsLookupApi } from '@shared/cards'
import { GameInfo } from '@shared/extra'
import {
	GameState,
	GameStateValue,
	PlayerStateValue,
	ProgressMilestoneType
} from '@shared/game'
import { UpdateDeepPartial } from '@shared/index'
import { GameModes } from '@shared/modes'
import { GameModeType } from '@shared/modes/types'
import { PlayerActionType } from '@shared/player-actions'
import { ProgressMilestones } from '@shared/progress-milestones'
import { initialGameState } from '@shared/states'
import { MyEvent } from '@/utils/events'
import { v4 as uuidv4 } from 'uuid'
import { Bot } from './bot'
import { EndedGameState } from './game-sm/ended-game-state'
import { EndingTilesGameState } from './game-sm/ending-tiles-game-state'
import { GenerationEndingState } from './game-sm/generation-ending-state'
import { GenerationInProgressGameState } from './game-sm/generation-in-progress-game-state'
import { GenerationStartGameState } from './game-sm/generation-start-game-state'
import { StartingGameState } from './game-sm/starting-game-state'
import { WaitingForPlayersGameState } from './game-sm/waiting-for-players-game-state'
import {
	CardPlayedEvent,
	Player,
	ProjectBought,
	TilePlacedEvent
} from './player'
import { MapType } from '@shared/map'
import { Maps } from '@shared/maps'
import { isMarsTerraformed } from '@shared/utils'

export interface GameConfig {
	bots: number
	adminPassword: string
	mode: GameModeType
	map: MapType
	name: string
	public: boolean
	spectatorsAllowed: boolean
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

	players: Player[] = []

	onStateUpdated = new MyEvent<Readonly<GameState>>()
	onPlayerKicked = new MyEvent<Player>()

	sm = new StateMachine<GameStateValue>()

	constructor(config?: Partial<GameConfig>) {
		this.config = {
			bots: 0,
			adminPassword: randomPassword(10),
			mode: GameModeType.Standard,
			map: MapType.Standard,
			name: 'Standard game',
			public: false,
			spectatorsAllowed: true,
			...config
		}

		this.state.map = Maps[this.config.map].build()
		this.state.name = this.config.name
		this.state.mode = this.config.mode

		range(0, this.config.bots).forEach(() => {
			this.add(new Bot(this), false)
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

		this.sm.addState(new WaitingForPlayersGameState(this))
		this.sm.addState(new StartingGameState(this))
		this.sm.addState(new GenerationInProgressGameState(this))
		this.sm.addState(new GenerationStartGameState(this))
		this.sm.addState(new GenerationEndingState(this))
		this.sm.addState(new EndingTilesGameState(this))
		this.sm.addState(new EndedGameState(this))

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

	get mode() {
		return GameModes[this.state.mode]
	}

	get isMarsTerraformed() {
		return isMarsTerraformed(this.state)
	}

	load = (state: GameState) => {
		this.state = state
		this.players = []

		state.players.forEach(p => {
			const player = p.bot ? new Bot(this) : new Player(this)
			player.state = p

			this.logger.log(
				f('Player {0} session: {1}', player.name, player.state.session)
			)

			this.add(player, false)
		})

		this.sm.currentState = this.sm.findState(this.state.state)
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

	all(state: PlayerStateValue) {
		return this.state.players.every(p => p.state === state)
	}

	checkState() {
		this.checkDisconnected()
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
									if (a.type === PlayerActionType.PickCorporation) {
										p.pickCorporation(a.cards[0])
									}

									if (a.type === PlayerActionType.PickCards) {
										p.pickCards([])
									}

									if (a.type === PlayerActionType.PickPreludes) {
										p.pickPreludes([])
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
							p.pass(true)
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
			spectatorsEnabled: this.config.spectatorsAllowed
		}
	}
}
