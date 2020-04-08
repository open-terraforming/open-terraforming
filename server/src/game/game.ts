import { deepExtend, range } from '@/utils/collections'
import { nextColor } from '@/utils/colors'
import { randomPassword } from '@/utils/password'
import { CardsLookupApi } from '@shared/cards'
import { Competitions, CompetitionType } from '@shared/competitions'
import { COMPETITIONS_REWARDS } from '@shared/constants'
import { Corporations } from '@shared/corporations'
import {
	GameState,
	GameStateValue,
	PlayerState,
	PlayerStateValue,
	ProgressMilestoneType
} from '@shared/game'
import { UpdateDeepPartial } from '@shared/index'
import { ProgressMilestones } from '@shared/progress-milestones'
import { initialGameState } from '@shared/states'
import { drawCard } from '@shared/utils'
import { MyEvent } from 'src/utils/events'
import { Bot } from './bot'
import { CardPlayedEvent, Player, TilePlacedEvent } from './player'
import { Logger } from '@/utils/log'
import { f } from '@/utils/string'

export interface GameConfig {
	bots: number
	adminPassword: string
}
export class Game {
	logger = new Logger('Game')

	config: GameConfig

	state = initialGameState()

	players: Player[] = []

	onStateUpdated = new MyEvent<Readonly<GameState>>()

	constructor(config?: Partial<GameConfig>) {
		this.config = {
			bots: 0,
			adminPassword: randomPassword(10),
			...config
		}
	}

	get inProgress() {
		return this.state.state !== GameStateValue.WaitingForPlayers
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
		this.state.players.push(player.state)

		player.onStateChanged.on(this.updated)

		// Dispatch passive events on player events
		player.onCardPlayed.on(this.handleCardPlayed)
		player.onTilePlaced.on(this.handleTilePlaced)

		this.logger.log(`Player ${player.name} (${player.id}) added to the game`)

		this.updated()
	}

	handleCardPlayed = ({
		player: playedBy,
		card,
		cardIndex: playedCardIndex
	}: CardPlayedEvent) => {
		this.players.forEach(player => {
			player.gameState.usedCards
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
									player: player.gameState,
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
		this.players.forEach(player => {
			player.gameState.usedCards
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
									player: player.gameState,
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
		return this.players.every(p => p.gameState.state === state)
	}

	get currentPlayer() {
		return this.state.players[this.state.currentPlayer]
	}

	startGame() {
		this.logger.log(`Game starting`)

		this.state.state = GameStateValue.PickingCorporations

		this.state.started = new Date().toISOString()
		this.state.oxygen = this.state.map.initialOxygen
		this.state.oceans = this.state.map.initialOceans
		this.state.temperature = this.state.map.initialTemperature

		if (this.players.length < this.config.bots) {
			range(0, this.config.bots - this.players.length).forEach(() => {
				this.add(new Bot(this))
			})
		}

		this.state.startingPlayer = Math.round(
			Math.random() * (this.players.length - 1)
		)

		this.players.forEach(p => {
			p.state.color = nextColor()
			p.gameState.state = PlayerStateValue.PickingCorporation
		})
	}

	checkState() {
		if (!this.players.every(p => !p.state.connected || p.state.bot)) {
			// Make sure disconnected players are not stalling others
			this.players.forEach(p => {
				if (!p.state.connected) {
					if (p.gameState.state === PlayerStateValue.PickingCorporation) {
						this.logger.log(
							`${p.name} is disconnected, picking first corporation`
						)
						p.pickCorporation(Corporations[0].code)
					}
					if (p.gameState.state === PlayerStateValue.PickingCards) {
						this.logger.log(
							`${p.name} is disconnected, cancelling card picking`
						)
						p.pickCards([])
					}
					if (p.gameState.state === PlayerStateValue.Playing) {
						this.logger.log(`${p.name} is disconnected, passing`)
						p.pass(true)
					}
				}
			})
		}

		switch (this.state.state) {
			case GameStateValue.WaitingForPlayers:
				if (this.players.length > 0 && this.all(PlayerStateValue.Ready)) {
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
					this.currentPlayer.gameState.state = PlayerStateValue.Passed
					this.nextPlayer()
					this.updated()
				}

				break
		}
	}

	finishGame() {
		this.logger.log(`Game finished`)

		this.state.state = GameStateValue.Ended

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
						p.gameState.terraformRating += COMPETITIONS_REWARDS[index]
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
			} while (this.currentPlayer.gameState.state === PlayerStateValue.Passed)

			this.logger.log(f(`Next player: {0}`, this.currentPlayer.name))

			this.currentPlayer.gameState.state = PlayerStateValue.Playing
			this.currentPlayer.gameState.actionsPlayed = 0
		}
	}

	endGeneration() {
		if (
			this.state.oceans >= this.state.map.oceans &&
			this.state.oxygen >= this.state.map.oxygen &&
			this.state.temperature >= this.state.map.temperature
		) {
			this.finishGame()
		} else {
			this.players.forEach(p => {
				p.endGeneration()
				p.gameState.state = PlayerStateValue.PickingCards
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
}
