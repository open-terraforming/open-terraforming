import { GameState, GameStateValue, PlayerStateValue } from '@shared/game'
import { Card, CardsLookupApi } from '@shared/cards'
import { Player } from './player'
import { MyEvent } from 'src/utils/events'
import { shuffle, range, deepExtend } from '@/utils/collections'
import { defaultMap } from '@shared/map'
import { Bot } from './bot'
import { UpdateDeepPartial } from '@shared/index'

export interface GameConfig {
	bots: number
}

export class Game {
	config: GameConfig

	state = {
		state: GameStateValue.WaitingForPlayers,
		generation: 1,
		currentPlayer: 0,
		players: [],
		oceans: 0,
		oxygen: 0,
		temperature: 0,
		map: defaultMap()
	} as GameState

	players: Player[] = []

	deck: Card[] = []

	onStateUpdated = new MyEvent<Readonly<GameState>>()

	constructor(config?: Partial<GameConfig>) {
		this.config = {
			bots: 0,
			...config
		}
	}

	get inProgress() {
		return this.state.state !== GameStateValue.WaitingForPlayers
	}

	updated = () => {
		this.onStateUpdated.emit(this.state)
	}

	add(player: Player) {
		if (this.players.length === 0) {
			player.admin = true
		}

		this.players.push(player)
		this.state.players.push(player.state)
		player.onStateChanged.on(this.updated)

		player.onCardPlayed.on(
			({ player: playedBy, card, cardIndex: playedCardIndex }) => {
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
		)

		player.onTilePlaced.on(({ player: playedBy, cell }) => {
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
		})

		this.onStateUpdated.emit(this.state)
	}

	remove(player: Player) {
		this.players = this.players.filter(p => p !== player)
		this.state.players = this.state.players.filter(p => p !== player.state)
		player.onStateChanged.off(this.updated)
		this.onStateUpdated.emit(this.state)
	}

	all(state: PlayerStateValue) {
		return this.state.players.every(p => p.gameState.state === state)
	}

	get currentPlayer() {
		return this.players[this.state.currentPlayer]
	}

	startGame() {
		if (this.players.length < this.config.bots) {
			range(0, this.config.bots - this.players.length).forEach(() => {
				this.add(new Bot(this))
			})
		}

		this.players.forEach(p => {
			p.gameState.state = PlayerStateValue.PickingCorporation
		})
		this.state.state = GameStateValue.PickingCorporations
		this.updated()
	}

	checkState() {
		switch (this.state.state) {
			case GameStateValue.WaitingForPlayers:
				if (this.players.length > 0 && this.all(PlayerStateValue.Ready)) {
					this.startGame()
				}
				break

			case GameStateValue.PickingCorporations:
			case GameStateValue.PickingCards:
				if (this.all(PlayerStateValue.WaitingForTurn)) {
					this.nextPlayer()
					this.state.state = GameStateValue.GenerationInProgress
					this.updated()
				}
				break
		}
	}

	nextPlayer() {
		if (this.all(PlayerStateValue.Passed)) {
			this.endGeneration()
		} else {
			do {
				this.state.currentPlayer =
					(this.state.currentPlayer + 1) % this.players.length
			} while (this.currentPlayer.gameState.state === PlayerStateValue.Passed)

			this.currentPlayer.gameState.state = PlayerStateValue.Playing
			this.currentPlayer.gameState.actionsPlayed = 0
		}
	}

	endGeneration() {
		this.players.forEach(p => {
			p.endGeneration()
			p.gameState.state = PlayerStateValue.PickingCards
			p.giveCards(4)
		})

		this.state.state = GameStateValue.PickingCards

		this.state.generation++
		this.updated()
	}

	nextCard(): Card {
		if (this.deck && this.deck.length > 0) {
			return this.deck.pop() as Card
		}

		this.shuffleCards()
		return this.nextCard()
	}

	shuffleCards() {
		const allCards = CardsLookupApi.data()
		if (!allCards) {
			throw new Error('No cards ready')
		}

		this.deck = [...Object.values(allCards)]
		shuffle(this.deck)
	}

	adminChange(data: UpdateDeepPartial<GameState>) {
		deepExtend(this.state, data)
		this.updated()
	}
}
