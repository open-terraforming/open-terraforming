import {
	PlayerState,
	PlayerStateValue,
	GameStateValue,
	UsedCardState,
	GridCellSpecial,
	GridCell
} from '@shared/game'
import { MyEvent } from 'src/utils/events'
import { Game } from './game'
import { v4 as uuidv4 } from 'uuid'
import { Corporations } from '@shared/corporations'
import { CARD_PRICE } from '@shared/constants'
import {
	CardCondition,
	CardCategory,
	CardEffectArgumentType,
	CardEffectTarget,
	CardsLookupApi,
	Card
} from '@shared/cards'
import { range } from '@/utils/collections'
import { cellByCoords } from '@shared/cards/utils'
import { PlacementConditionsLookup } from '@shared/placements'

interface CardPlayedEvent {
	player: Player
	card: Card
	cardIndex: number
}
interface TilePlacedEvent {
	player: Player
	cell: GridCell
}

export class Player {
	static idCounter = 1

	state = {
		connected: false,
		id: Player.idCounter++,
		bot: false,
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
			orePrice: 2,
			titan: 0,
			titanProduction: 1,
			titanPrice: 2,
			plants: 0,
			plantsProduction: 1,
			passed: false,
			state: PlayerStateValue.Connecting,
			terraformRating: 20,
			cards: [],
			usedCards: [],
			cardsPick: [],
			corporation: '',
			spacePriceChange: 0,
			cardPriceChange: 0,
			cardsPickFree: false,
			cardsPickLimit: 0,
			cardsToPlay: [],
			earthPriceChange: 0,
			placingTile: []
		},
		name: '<unknown>',
		session: uuidv4()
	} as PlayerState

	onStateChanged = new MyEvent<Readonly<PlayerState>>()
	onCardPlayed = new MyEvent<Readonly<CardPlayedEvent>>()
	onTilePlaced = new MyEvent<Readonly<TilePlacedEvent>>()

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

		this.gameState.money = corp.startingMoney
		this.gameState.ore = corp.startingOre
		this.gameState.plants = corp.startingPlants
		this.gameState.titan = corp.startingTitan
		this.gameState.heat = corp.startingHeat
		this.gameState.energy = corp.startingEnergy

		range(0, corp.startingCards + 1).forEach(() => {
			this.gameState.cards.push(this.game.nextCard().code)
		})

		if (corp.pickingCards) {
			this.giveCards(10)
			this.gameState.state = PlayerStateValue.PickingCards
		} else {
			this.gameState.state = PlayerStateValue.WaitingForTurn
		}

		this.updated()
		this.game.checkState()
	}

	pickCards(cards: number[]) {
		if (new Set(cards).size !== cards.length) {
			throw new Error('You cant pick one card twice')
		}

		if (cards.find(c => c >= this.gameState.cardsPick.length || c < 0)) {
			throw new Error('Invalid list of cards to pick')
		}

		if (this.gameState.cardsPickLimit > 0) {
			if (cards.length !== this.gameState.cardsPickLimit) {
				throw new Error(`You have to pick ${cards.length} cards`)
			}
		}

		if (!this.gameState.cardsPickFree) {
			if (cards.length * CARD_PRICE > this.gameState.money) {
				throw new Error("You don't have money for that")
			}

			this.gameState.money -= cards.length * CARD_PRICE
		}

		this.gameState.cards = [
			...this.gameState.cards,
			...cards.map(c => this.gameState.cardsPick[c])
		]

		this.gameState.cardsPick = []
		this.gameState.cardsPickFree = false
		this.gameState.cardsPickLimit = 0

		switch (this.game.state.state) {
			case GameStateValue.PickingCorporations:
			case GameStateValue.PickingCards: {
				this.gameState.state = PlayerStateValue.WaitingForTurn
				break
			}

			case GameStateValue.GenerationInProgress: {
				this.gameState.state = PlayerStateValue.Playing
				this.actionPlayed()
				break
			}
		}

		this.updated()
		this.game.checkState()
	}

	buyCard(
		cardCode: string,
		index: number,
		useOre: number,
		useTitan: number,
		playArguments: CardEffectArgumentType[][]
	) {
		if (!this.isPlaying) {
			return
		}

		if (this.gameState.cards[index] !== cardCode) {
			throw new Error(
				'Something is wrong, incorrect card index and card type combination'
			)
		}

		const card = CardsLookupApi.get(cardCode)

		if (!card) {
			throw new Error(`Unknown card ${cardCode}`)
		}

		let adjustedCost = card.cost

		if (useOre > 0) {
			if (!card.categories.includes(CardCategory.Building)) {
				throw new Error('You can only use ore to pay for buildings')
			}

			if (useOre > this.gameState.ore) {
				throw new Error("You don't have that much ore")
			}

			adjustedCost -= useOre * this.gameState.orePrice
		}

		if (useTitan > 0) {
			if (!card.categories.includes(CardCategory.Space)) {
				throw new Error('You can only use titan to pay for space cards')
			}

			if (useTitan > this.gameState.titan) {
				throw new Error("You don't have that much titan")
			}

			adjustedCost -= useTitan * this.gameState.titanPrice
		}

		if (this.gameState.money < adjustedCost) {
			throw new Error(
				`You don't have money for that, adjusted price was ${adjustedCost}.`
			)
		}

		const cardState = {
			code: cardCode,
			animals: 0,
			microbes: 0,
			played: false,
			science: 0
		} as UsedCardState

		const ctx = {
			player: this.gameState,
			playerId: this.id,
			game: this.game.state,
			card: cardState,
			cardIndex: this.gameState.usedCards.length
		}

		const errorConditions = [
			...card.conditions.filter(c => !c.evaluate(ctx)),
			...card.playEffects.reduce(
				(acc, p, ei) => [
					...acc,
					...p.conditions.filter(
						c => !c.evaluate(ctx, ...(playArguments[ei] || []))
					)
				],
				[] as CardCondition[]
			)
		]

		if (errorConditions.length > 0) {
			throw new Error(
				`Card conditions not met! ${errorConditions
					.map(c => c.description)
					.filter(c => !!c)
					.join('. ')}`
			)
		}

		this.gameState.money -= Math.max(0, adjustedCost)
		this.gameState.titan -= useTitan
		this.gameState.ore -= useOre

		card.playEffects.forEach((e, i) => {
			// Run dynamic arguments
			e.args.forEach((a, ai) => {
				if (!playArguments[i]) {
					playArguments[i] = []
				}

				if (a.type === CardEffectTarget.DrawnCards) {
					playArguments[i][ai] = range(0, (a.drawnCards || 1) - 1).map(
						() => this.game.nextCard().code
					)
				}
			})

			e.perform(ctx, ...(playArguments[i] || []))
		})

		this.gameState.usedCards.push(cardState)
		this.gameState.cards.splice(index, 1)

		this.onCardPlayed.emit({
			card,
			cardIndex: ctx.cardIndex,
			player: this
		})

		if (this.gameState.placingTile.length > 0) {
			this.gameState.state = PlayerStateValue.PlacingTile
		} else {
			this.actionPlayed()
		}

		this.updated()
	}

	giveCards(count: number) {
		this.gameState.cardsPick = []
		for (let i = 0; i < count; i++) {
			this.gameState.cardsPick.push(this.game.nextCard().code)
		}
	}

	placeTile(x: number, y: number) {
		if (this.gameState.state !== PlayerStateValue.PlacingTile) {
			throw new Error('Player is not placing tile right now')
		}

		const pendingTile = this.gameState.placingTile[0]

		if (!pendingTile) {
			throw new Error('No tile to place!')
		}

		const cell = cellByCoords(this.game.state, x, y)

		if (!cell) {
			throw new Error('Cell not found')
		}

		if (
			cell.content ||
			(cell.claimantId !== undefined && cell.claimantId !== this.id)
		) {
			throw new Error(`Cell is already owned by someone else`)
		}

		if (pendingTile.conditions) {
			const errors = pendingTile.conditions
				.map(c => PlacementConditionsLookup.get(c))
				.filter(
					c =>
						!c.evaluate({
							game: this.game.state,
							player: this.gameState,
							playerId: this.id,
							cell
						})
				)
			if (errors.length > 0) {
				throw new Error(
					`Placement not possible: ${errors.map(e => e.description).join(', ')}`
				)
			}
		}

		if (
			pendingTile.special &&
			pendingTile.special.length &&
			(!cell.special || !pendingTile.special.includes(cell.special))
		) {
			throw new Error(
				`You cannot place tile here, can only be placed at: ${pendingTile.special
					.map(s => GridCellSpecial[s])
					.join(' or ')}`
			)
		}

		cell.content = pendingTile.type
		cell.other = pendingTile.other
		cell.ownerCard = pendingTile.ownerCard
		cell.ownerId = this.state.id

		this.gameState.placingTile.shift()

		this.onTilePlaced.emit({
			cell,
			player: this
		})

		if (this.gameState.placingTile.length === 0) {
			this.gameState.state = PlayerStateValue.Playing
			this.actionPlayed()
		}

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

	endGeneration() {
		const state = this.state.gameState

		// Perform production
		state.heat += state.energy + state.energyProduction
		state.energy += state.energyProduction
		state.ore += state.oreProduction
		state.titan += state.titanProduction
		state.plants += state.plantsProduction
		state.money += state.terraformRating + state.moneyProduction

		// Reset playable cards
		state.usedCards.forEach(c => (c.played = false))
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
