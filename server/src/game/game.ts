import { GameState, GameStateValue, PlayerStateValue } from '@shared/game'
import { Card, Cards, CardsLookupApi } from '@shared/cards'
import { Player } from './player'
import { MyEvent } from 'src/utils/events'
import { shuffle } from '@/utils/collections'
import { defaultMap } from '@shared/map'

export class Game {
	state = {
		state: GameStateValue.WaitingForPlayers,
		generation: 1,
		currentPlayer: 0,
		players: [],
		oceans: 0,
		oxygen: 0,
		temperature: -30,
		map: defaultMap()
	} as GameState

	players: Player[] = []

	deck: Card[] = []

	onStateUpdated = new MyEvent<Readonly<GameState>>()

	get inProgress() {
		return this.state.state !== GameStateValue.WaitingForPlayers
	}

	updated = () => {
		this.onStateUpdated.emit(this.state)
	}

	add(player: Player) {
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

	checkState() {
		switch (this.state.state) {
			case GameStateValue.WaitingForPlayers:
				if (this.players.length > 0 && this.all(PlayerStateValue.Ready)) {
					this.giveCards(10)
					this.players.forEach(p => {
						p.gameState.state = PlayerStateValue.PickingCorporation
					})
					this.state.state = GameStateValue.PickingCorporations
					this.updated()
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

	giveCards(count: number) {
		this.players.forEach(p => {
			p.gameState.cardsPick = []
			for (let i = 0; i < count; i++) {
				p.gameState.cardsPick.push(this.nextCard().code)
			}
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

			this.currentPlayer.gameState.state = PlayerStateValue.Playing
			this.currentPlayer.gameState.actionsPlayed = 0
		}
	}

	endGeneration() {
		this.players.forEach(p => {
			p.endGeneration()
			p.gameState.state = PlayerStateValue.PickingCards
		})

		this.giveCards(4)
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
		this.deck = [...Cards]
		shuffle(this.deck)
	}
}
