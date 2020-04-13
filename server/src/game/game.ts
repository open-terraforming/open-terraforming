import { deepExtend, range, shuffle } from '@/utils/collections'
import { nextColor } from '@/utils/colors'
import { Logger } from '@/utils/log'
import { randomPassword } from '@/utils/password'
import { f } from '@/utils/string'
import { CardsLookupApi, CardType } from '@shared/cards'
import { Competitions, CompetitionType } from '@shared/competitions'
import { COMPETITIONS_REWARDS } from '@shared/constants'
import { Corporations } from '@shared/corporations'
import {
	GameState,
	GameStateValue,
	PlayerState,
	PlayerStateValue,
	ProgressMilestoneType,
	VictoryPointsSource
} from '@shared/game'
import { UpdateDeepPartial } from '@shared/index'
import { GameModes } from '@shared/modes'
import { GameModeType } from '@shared/modes/types'
import { ProgressMilestones } from '@shared/progress-milestones'
import { initialGameState } from '@shared/states'
import { MyEvent } from 'src/utils/events'
import { Bot } from './bot'
import {
	CardPlayedEvent,
	Player,
	ProjectBought,
	TilePlacedEvent
} from './player'
import { GameInfo } from '@shared/extra'
import { v4 as uuidv4 } from 'uuid'

export interface GameConfig {
	bots: number
	adminPassword: string
	mode: GameModeType
	name: string
	public: boolean
}
export class Game {
	logger = new Logger('Game')

	config: GameConfig

	state = initialGameState(uuidv4())

	players: Player[] = []

	onStateUpdated = new MyEvent<Readonly<GameState>>()

	constructor(config?: Partial<GameConfig>) {
		this.config = {
			bots: 0,
			adminPassword: randomPassword(10),
			mode: GameModeType.Standard,
			name: 'Standard game',
			public: false,
			...config
		}

		this.state.name = this.config.name
		this.state.mode = this.config.mode

		range(0, this.config.bots).forEach(() => {
			this.add(new Bot(this))
		})
	}

	get inProgress() {
		return this.state.state !== GameStateValue.WaitingForPlayers
	}

	load = (state: GameState) => {
		this.state = state
		this.players = []
		state.players.forEach(p => {
			const player = new Player(this)
			player.state = p

			this.logger.log(
				f('Player {0} session: {1}', player.name, player.state.session)
			)

			this.add(player)
		})
	}

	updated = () => {
		this.checkState()
		this.onStateUpdated.emit(this.state)
	}

	add(player: Player) {
		if (this.players.find(p => p.id === player.id)) {
			throw new Error(`ID ${player.id} is not unique player id`)
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

		this.updated()
	}

	handleGenerationEnd = () => {
		this.state.players.forEach(player => {
			player.usedCards
				.map(c => [c, CardsLookupApi.get(c.code)] as const)
				.forEach(([s, c], cardIndex) => {
					c.passiveEffects.forEach(
						e =>
							e.onGenerationEnd &&
							e.onGenerationEnd({
								card: s,
								cardIndex,
								game: this.state,
								player: player,
								playerId: player.id
							})
					)
				})
		})
	}

	handleProjectBought = ({ player: playedBy, project }: ProjectBought) => {
		this.state.players.forEach(player => {
			player.usedCards
				.map(c => [c, CardsLookupApi.get(c.code)] as const)
				.forEach(([s, c], cardIndex) => {
					c.passiveEffects.forEach(
						e =>
							e.onStandardProject &&
							e.onStandardProject(
								{
									card: s,
									cardIndex,
									game: this.state,
									player: player,
									playerId: player.id
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
				.forEach(([s, c], cardIndex) => {
					c.passiveEffects.forEach(
						e =>
							e.onCardPlayed &&
							e.onCardPlayed(
								{
									card: s,
									cardIndex,
									game: this.state,
									player: player,
									playerId: player.id
								},
								card,
								playedCardIndex,
								playedBy.state
							)
					)
				})
		})
	}

	handleTilePlaced = ({ player: playedBy, cell }: TilePlacedEvent) => {
		this.state.players.forEach(player => {
			player.usedCards
				.map(c => [c, CardsLookupApi.get(c.code)] as const)
				.forEach(([s, c], cardIndex) => {
					c.passiveEffects.forEach(
						e =>
							e.onTilePlaced &&
							e.onTilePlaced(
								{
									card: s,
									cardIndex,
									game: this.state,
									player: player,
									playerId: player.id
								},
								cell,
								playedBy.state
							)
					)
				})
		})
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

	all(state: PlayerStateValue) {
		return this.state.players.every(p => p.state === state)
	}

	get currentPlayer() {
		return this.state.players[this.state.currentPlayer]
	}

	get mode() {
		return GameModes[this.state.mode]
	}

	startGame() {
		this.logger.log(`Game starting`)

		this.state.state = GameStateValue.PickingCorporations

		this.state.started = new Date().toISOString()
		this.state.oxygen = this.state.map.initialOxygen
		this.state.oceans = this.state.map.initialOceans
		this.state.temperature = this.state.map.initialTemperature

		this.state.startingPlayer = Math.round(
			Math.random() * (this.players.length - 1)
		)

		this.state.players.forEach(p => {
			p.color = nextColor()
		})

		let cards = Object.values(CardsLookupApi.data()).filter(
			c => c.type !== CardType.Corporation
		)
		if (this.mode.filterCards) {
			cards = this.mode.filterCards(cards)
		}

		this.state.cards = shuffle(cards.map(c => c.code))

		if (this.mode.onGameStart) {
			this.mode.onGameStart(this.state)
		}
	}

	checkState() {
		if (!this.players.every(p => !p.state.connected || p.state.bot)) {
			// Make sure disconnected players are not stalling others
			this.players.forEach(p => {
				if (!p.state.connected) {
					if (p.state.state === PlayerStateValue.PickingCorporation) {
						this.logger.log(
							`${p.name} is disconnected, picking first corporation`
						)
						p.pickCorporation(Corporations[0].code)
					}
					if (p.state.state === PlayerStateValue.PickingCards) {
						this.logger.log(
							`${p.name} is disconnected, cancelling card picking`
						)
						p.pickCards([])
					}
					if (p.state.state === PlayerStateValue.Playing) {
						this.logger.log(`${p.name} is disconnected, passing`)
						p.pass(true)
					}
				}
			})
		}

		switch (this.state.state) {
			case GameStateValue.WaitingForPlayers:
				if (
					this.players.filter(p => !p.state.bot).length > 0 &&
					this.all(PlayerStateValue.Ready)
				) {
					this.startGame()
				}
				break

			case GameStateValue.PickingCorporations:
			case GameStateValue.PickingCards:
				if (this.all(PlayerStateValue.WaitingForTurn)) {
					this.logger.log(`All players ready, starting the round`)

					this.state.currentPlayer = this.state.startingPlayer - 1
					this.nextPlayer()
					this.state.state = GameStateValue.GenerationInProgress
					this.updated()
				}
				break

			case GameStateValue.GenerationInProgress:
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

				if (!this.currentPlayer.connected) {
					this.currentPlayer.state = PlayerStateValue.Passed
					this.nextPlayer()
					this.updated()
				}

				break
		}
	}

	finishGame() {
		this.logger.log(`Game finished`)

		this.state.state = GameStateValue.Ended

		this.players.forEach(p => {
			p.state.victoryPoints.push({
				source: VictoryPointsSource.Rating,
				amount: p.state.terraformRating
			})
		})

		this.state.competitions.forEach(({ type }) => {
			const competition = Competitions[type]
			const score = this.state.players.reduce((acc, p) => {
				const s = competition.getScore(this.state, p)

				if (!acc[s]) {
					acc[s] = []
				}

				acc[s].push(p)

				return acc
			}, {} as Record<number, PlayerState[]>)

			Object.entries(score)
				.sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
				.slice(0, 2)
				.forEach(([, players], index) => {
					players.forEach(p => {
						this.logger.log(
							f(
								`Player {0} is {1}. at {3} competition`,
								p.name,
								index + 1,
								CompetitionType[type]
							)
						)
						p.victoryPoints.push({
							source: VictoryPointsSource.Awards,
							amount: COMPETITIONS_REWARDS[index],
							competition: type
						})
					})
				})
		})

		this.players.forEach(p => {
			p.finishGame()
		})
	}

	nextPlayer() {
		if (this.all(PlayerStateValue.Passed)) {
			this.endGeneration()
		} else {
			do {
				this.state.currentPlayer =
					(this.state.currentPlayer + 1) % this.players.length
			} while (this.currentPlayer.state === PlayerStateValue.Passed)

			this.logger.log(f(`Next player: {0}`, this.currentPlayer.name))

			this.currentPlayer.state = PlayerStateValue.Playing
			this.currentPlayer.actionsPlayed = 0
		}
	}

	endGeneration() {
		this.handleGenerationEnd()

		this.players.forEach(p => {
			p.endGeneration()
		})

		if (
			this.state.oceans >= this.state.map.oceans &&
			this.state.oxygen >= this.state.map.oxygen &&
			this.state.temperature >= this.state.map.temperature
		) {
			this.finishGame()
		} else {
			this.players.forEach(p => {
				p.state.state = PlayerStateValue.PickingCards
				p.giveCards(4)
			})

			this.state.state = GameStateValue.PickingCards

			this.state.generation++

			this.state.startingPlayer =
				(this.state.startingPlayer + 1) % this.players.length

			this.logger.log(`New generation ${this.state.generation}`)
		}
		this.updated()
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
			maxPlayers: this.state.maxPlayers
		}
	}
}
