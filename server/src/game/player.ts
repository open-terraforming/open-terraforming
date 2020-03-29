import { PlayerState, PlayerStateValue, GameStateValue } from '@shared/game'
import { MyEvent } from 'src/utils/events'
import { Game } from './game'
import { v4 as uuidv4 } from 'uuid'
import { Corporations } from '@shared/corporations'
import { CARD_PRICE } from '@shared/constants'

export class Player {
	static idCounter = 1

	state = {
		connected: false,
		id: Player.idCounter++,
		gameState: {
			actionsPlayed: 0,
			energy: 0,
			energyProduction: 1,
			heat: 0,
			heatProduction: 1,
			money: 0,
			moneyProduction: 1,
			ore: 0,
			oreProduction: 1,
			titan: 0,
			titanProduction: 1,
			plants: 0,
			plantsProduction: 1,
			passed: false,
			state: PlayerStateValue.Connecting,
			terraformRating: 20,
			cards: [],
			usedCards: [],
			cardsPick: [],
			corporation: ''
		},
		name: '<unknown>',
		session: uuidv4()
	} as PlayerState

	onStateChanged = new MyEvent<Readonly<PlayerState>>()

	game: Game

	get gameState() {
		return this.state.gameState
	}

	get corporation() {
		return Corporations.find(c => c.code === this.state.gameState.corporation)
	}

	get name() {
		return this.state.name
	}

	set name(value: string) {
		this.state.name = value
		this.updated()
	}

	get id() {
		return this.state.id
	}

	set id(value: number) {
		this.state.id = value
		this.updated()
	}

	get actionsPlayed() {
		return this.state.gameState.actionsPlayed
	}

	set actionsPlayer(number: number) {
		this.state.gameState.actionsPlayed = number
	}

	get isPlaying() {
		return (
			this.game.currentPlayer === this &&
			this.gameState.state === PlayerStateValue.Playing
		)
	}

	constructor(game: Game) {
		this.game = game
	}

	setState(state: PlayerStateValue) {
		switch (state) {
			case PlayerStateValue.Ready: {
				if (this.game.state.state === GameStateValue.WaitingForPlayers) {
					this.state.gameState.state = state
					this.game.checkState()
				} else {
					throw new Error(
						`Player cannot switch to Ready when game is at ${
							GameStateValue[this.game.state.state]
						}`
					)
				}

				break
			}

			case PlayerStateValue.Waiting: {
				if (this.game.state.state === GameStateValue.WaitingForPlayers) {
					this.state.gameState.state = state
				} else {
					throw new Error(
						`Player cannot switch to Waiting when game is at ${
							GameStateValue[this.game.state.state]
						}`
					)
				}

				break
			}
		}

		this.updated()
	}

	pickCorporation(code: string) {
		const corp = Corporations.find(c => c.code === code)
		if (!corp) {
			throw new Error(`Unknown corporation ${code}`)
		}

		this.gameState.corporation = code
		this.gameState.state = PlayerStateValue.PickingCards

		this.gameState.money = corp.startingMoney
		this.gameState.ore = corp.startingOre
		this.gameState.plants = corp.startingPlants
		this.gameState.titan = corp.startingTitan
		this.gameState.heat = corp.startingHeat
		this.gameState.energy = corp.startingEnergy

		this.updated()
	}

	pickCards(cards: number[]) {
		if (new Set(cards).size !== cards.length) {
			throw new Error('You cant pick one card twice')
		}

		if (cards.find(c => c >= this.gameState.cardsPick.length || c < 0)) {
			throw new Error('Invalid list of cards to pick')
		}

		if (cards.length * CARD_PRICE > this.gameState.money) {
			throw new Error("You don't have money for that")
		}

		this.gameState.money -= cards.length * CARD_PRICE
		this.gameState.cards = [
			...this.gameState.cards,
			...cards.map(c => this.gameState.cardsPick[c])
		]

		this.gameState.state = PlayerStateValue.WaitingForTurn
		this.updated()
		this.game.checkState()
	}

	buyCard(card: string, index: number) {
		if (!this.isPlaying) {
			return
		}

		if (this.gameState.cards[index] !== card) {
			throw new Error(
				'Something is wrong, incorrect card index and card type combination'
			)
		}

		// TODO: Actually play the card

		this.gameState.cards.splice(index, 1)
		this.updated()
	}

	actionPlayed() {
		this.gameState.actionsPlayed++

		if (this.gameState.actionsPlayed >= 2) {
			this.gameState.state = PlayerStateValue.WaitingForTurn
			this.game.nextPlayer()
			this.game.updated()
		}
	}

	pass(force = false) {
		if (!this.isPlaying) {
			return
		}

		this.gameState.state =
			this.gameState.actionsPlayed === 0 || force
				? PlayerStateValue.Passed
				: PlayerStateValue.WaitingForTurn
		this.game.nextPlayer()
		this.game.updated()
	}

	updated() {
		this.onStateChanged.emit(this.state)
	}

	doProduction() {
		const state = this.state.gameState
		state.heat += state.energy + state.energyProduction
		state.energy += state.energyProduction
		state.ore += state.oreProduction
		state.titan += state.titanProduction
		state.plants += state.plantsProduction
		state.money += state.terraformRating + state.moneyProduction
		this.updated()
	}

	reset() {
		this.state.gameState = {
			...this.state.gameState,
			actionsPlayed: 0,
			energy: 0,
			energyProduction: 1,
			heat: 0,
			heatProduction: 1,
			money: 0,
			moneyProduction: 1,
			ore: 0,
			oreProduction: 1,
			terraformRating: 20,
			titan: 0,
			titanProduction: 1
		}
	}
}
