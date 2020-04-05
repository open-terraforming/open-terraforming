import {
	PlayerState,
	PlayerStateValue,
	GameStateValue,
	UsedCardState,
	GridCellSpecial,
	GridCell,
	GridCellContent,
	GridCellType,
	StandardProjectType
} from '@shared/game'
import { MyEvent } from 'src/utils/events'
import { Game } from './game'
import { v4 as uuidv4 } from 'uuid'
import { Corporations } from '@shared/corporations'
import {
	CARD_PRICE,
	MILESTONES_LIMIT,
	MILESTONE_PRICE,
	COMPETITIONS_LIMIT,
	COMPETITIONS_PRICES,
	MILESTONE_REWARD
} from '@shared/constants'
import {
	CardCondition,
	CardCategory,
	CardEffectArgumentType,
	CardEffectTarget,
	CardsLookupApi,
	Card,
	CardCallbackContext,
	CardType,
	CardEffect
} from '@shared/cards'
import { range } from '@/utils/collections'
import { cellByCoords, adjustedCardPrice } from '@shared/cards/utils'
import { PlacementConditionsLookup, canPlace } from '@shared/placements'
import { allCells, adjacentCells } from '@shared/utils'
import { Projects } from '@shared/projects'
import { MilestoneType, Milestones } from '@shared/milestones'
import { CompetitionType } from '@shared/competitions'

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
			titanPrice: 3,
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
		color: '#000',
		session: uuidv4()
	} as PlayerState

	admin = true

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
		console.log(this.game.currentPlayer.id, this.id, this.gameState.state)

		return (
			this.game.currentPlayer.id === this.id &&
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
		if (this.gameState.state !== PlayerStateValue.PickingCorporation) {
			throw new Error('You are not picking corporations right now')
		}

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

		range(0, corp.startingCards).forEach(() => {
			this.gameState.cards.push(this.game.nextCard().code)
		})

		if (corp.pickingCards) {
			this.giveCards(10)
			this.gameState.state = PlayerStateValue.PickingCards
		} else {
			this.gameState.state = PlayerStateValue.WaitingForTurn
		}

		this.updated()
	}

	pickCards(cards: number[]) {
		if (this.gameState.state !== PlayerStateValue.PickingCards) {
			throw new Error('You are not picking cards right now')
		}

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
	}

	buyCard(
		cardCode: string,
		index: number,
		useOre: number,
		useTitan: number,
		playArguments: CardEffectArgumentType[][]
	) {
		if (!this.isPlaying) {
			throw new Error("You're not playing")
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

		let cost = adjustedCardPrice(card, this.gameState)

		if (useOre > 0) {
			if (!card.categories.includes(CardCategory.Building)) {
				throw new Error('You can only use ore to pay for buildings')
			}

			if (useOre > this.gameState.ore) {
				throw new Error("You don't have that much ore")
			}

			cost -= useOre * this.gameState.orePrice
		}

		if (useTitan > 0) {
			if (!card.categories.includes(CardCategory.Space)) {
				throw new Error('You can only use titan to pay for space cards')
			}

			if (useTitan > this.gameState.titan) {
				throw new Error("You don't have that much titan")
			}

			cost -= useTitan * this.gameState.titanPrice
		}

		if (this.gameState.money < cost) {
			throw new Error(
				`You don't have money for that, adjusted price was ${cost}.`
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

		this.checkCardConditions(card, ctx, playArguments)

		this.gameState.money -= Math.max(0, cost)
		this.gameState.titan -= useTitan
		this.gameState.ore -= useOre

		card.playEffects.forEach((e, i) => {
			// Run dynamic arguments
			e.args.forEach((a, ai) => {
				if (!playArguments[i]) {
					playArguments[i] = []
				}

				if (a.type === CardEffectTarget.DrawnCards) {
					console.log('Drawing', a.drawnCards)
					playArguments[i][ai] = range(0, a.drawnCards || 1).map(
						() => this.game.nextCard().code
					)
					console.log(playArguments[i][ai])
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

		if (
			this.gameState.placingTile.length === 0 &&
			this.gameState.state !== PlayerStateValue.PickingCards
		) {
			this.actionPlayed()
		}

		this.updated()
	}

	checkCardConditions(
		card: Card,
		ctx: CardCallbackContext,
		playArguments: CardEffectArgumentType[][],
		action = false
	) {
		const errorConditions = [
			...card.conditions.filter(c => !c.evaluate(ctx)),
			...(action ? card.actionEffects : card.playEffects).reduce(
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
	}

	giveCards(count: number) {
		this.gameState.cardsPick = []
		for (let i = 0; i < count; i++) {
			this.gameState.cardsPick.push(this.game.nextCard().code)
		}
	}

	placeTile(x: number, y: number) {
		if (!this.isPlaying) {
			throw new Error('Player is not playing now')
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
			(cell.special === undefined ||
				!pendingTile.special.includes(cell.special))
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

		this.gameState.ore += cell.ore
		this.gameState.titan += cell.titan
		this.gameState.plants += cell.plants

		range(0, cell.cards).forEach(() => {
			this.gameState.cards.push(this.game.nextCard().code)
		})

		switch (pendingTile.type) {
			case GridCellContent.Forest: {
				if (this.game.state.oxygen < this.game.state.map.oxygen) {
					this.game.state.oxygen++
					this.gameState.terraformRating++
				}
				break
			}
			case GridCellContent.Ocean: {
				this.gameState.terraformRating++
				this.game.state.oceans++
				break
			}
		}

		this.gameState.money +=
			adjacentCells(this.game.state, cell.x, cell.y).filter(
				c => c.content === GridCellContent.Ocean
			).length * 2

		this.gameState.placingTile.shift()

		this.onTilePlaced.emit({
			cell,
			player: this
		})

		this.checkTilePlacement()

		if (this.gameState.placingTile.length === 0) {
			this.gameState.state = PlayerStateValue.Playing
			this.actionPlayed()
		}

		this.updated()
	}

	runCardEffects(
		effects: CardEffect[],
		ctx: CardCallbackContext,
		playArguments: CardEffectArgumentType[][]
	) {
		effects.forEach((e, i) => {
			// Run dynamic arguments
			e.args.forEach((a, ai) => {
				if (!playArguments[i]) {
					playArguments[i] = []
				}

				if (a.type === CardEffectTarget.DrawnCards) {
					playArguments[i][ai] = range(0, a.drawnCards || 1).map(
						() => this.game.nextCard().code
					)
				}
			})

			e.perform(ctx, ...(playArguments[i] || []))
		})

		this.checkTilePlacement()
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

		// Force pass if everybody else passed
		if (
			this.game.state.players.every(
				p => p.id === this.id || p.gameState.state === PlayerStateValue.Passed
			)
		) {
			force = true
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
		state.heat += state.energy + state.heatProduction
		state.energy = state.energyProduction
		state.ore += state.oreProduction
		state.titan += state.titanProduction
		state.plants += state.plantsProduction
		state.money += state.terraformRating + state.moneyProduction

		// Reset playable cards
		state.usedCards.forEach(c => (c.played = false))
	}

	playCard(
		cardCode: string,
		index: number,
		playArguments: CardEffectArgumentType[][]
	) {
		if (
			this.gameState.cardsToPlay.length > 0 &&
			this.gameState.cardsToPlay[0] !== index
		) {
			throw new Error(
				'You have to resolve pending events before playing other cards'
			)
		}

		if (this.gameState.cardsToPlay.length === 0 && !this.isPlaying) {
			throw new Error("You're not playing")
		}

		const cardState = this.gameState.usedCards[index]

		if (cardState === undefined || cardState?.code !== cardCode) {
			throw new Error(
				'Something is wrong, incorrect card index and card type combination'
			)
		}

		if (cardState.played) {
			throw new Error('Card was already played this generation')
		}

		const card = CardsLookupApi.get(cardCode)

		if (!card) {
			throw new Error(`Unknown card ${cardCode}`)
		}

		if (card.type !== CardType.Action && card.type !== CardType.Effect) {
			throw new Error("This card isn't playable")
		}

		const ctx = {
			player: this.gameState,
			playerId: this.id,
			game: this.game.state,
			card: cardState,
			cardIndex: index
		}

		this.checkCardConditions(card, ctx, playArguments, true)

		this.runCardEffects(card.actionEffects, ctx, playArguments)

		if (this.gameState.cardsToPlay.length > 0) {
			this.gameState.cardsToPlay.shift()
		} else {
			cardState.played = true

			this.onCardPlayed.emit({
				card,
				cardIndex: ctx.cardIndex,
				player: this
			})

			if (
				this.gameState.placingTile.length === 0 &&
				this.gameState.state !== PlayerStateValue.PickingCards
			) {
				this.actionPlayed()
			}
		}

		this.updated()
	}

	checkTilePlacement() {
		this.gameState.placingTile = this.gameState.placingTile.filter(
			t =>
				(t.type !== GridCellContent.Ocean ||
					this.game.state.oceans < this.game.state.map.oceans) &&
				!!allCells(this.game.state).find(c =>
					canPlace(this.game.state, this.state, c, t)
				)
		)
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

	finishGame() {
		const cardVps = this.gameState.usedCards.reduce((acc, state, cardIndex) => {
			const card = CardsLookupApi.get(state.code)
			acc += card.victoryPoints
			if (card.victoryPointsCallback) {
				acc += card.victoryPointsCallback.compute({
					card: state,
					cardIndex,
					game: this.game.state,
					player: this.gameState,
					playerId: this.id
				})
			}
			return acc
		}, 0)

		const tileVps = allCells(this.game.state).reduce((acc, cell) => {
			if (cell.ownerId === this.id) {
				switch (cell.content) {
					case GridCellContent.Forest: {
						return acc + 1
					}
					case GridCellContent.City: {
						return (
							acc +
							adjacentCells(this.game.state, cell.x, cell.y).filter(
								c => c.content === GridCellContent.Forest
							).length
						)
					}
				}
			}
			return acc
		}, 0)

		const milestonesVps =
			this.game.state.milestones.filter(m => m.playerId === this.state.id)
				.length * MILESTONE_REWARD

		this.gameState.terraformRating += cardVps
		this.gameState.terraformRating += tileVps
		this.gameState.terraformRating += milestonesVps
	}

	buyStandardProject(projectType: StandardProjectType, cards: number[]) {
		if (!this.isPlaying) {
			throw new Error("You're not playing")
		}

		const project = Projects[projectType]
		const ctx = {
			game: this.game.state,
			player: this.state
		}

		if (!project.conditions.every(c => c(ctx))) {
			throw new Error(`You cannot execute ${StandardProjectType[projectType]}`)
		}

		project.execute(ctx, cards)

		if (this.gameState.placingTile.length === 0) {
			this.actionPlayed()
		}

		this.updated()
	}

	buyMilestone(type: MilestoneType) {
		if (!this.isPlaying) {
			throw new Error("You're not playing")
		}

		if (this.game.state.milestones.length >= MILESTONES_LIMIT) {
			throw new Error('All milestones are taken')
		}

		if (this.gameState.money < MILESTONE_PRICE) {
			throw new Error("You can't afford a milestone")
		}

		if (this.game.state.milestones.find(c => c.type === type)) {
			throw new Error('This milestone is already owned')
		}

		const milestone = Milestones[type]

		if (milestone.getValue(this.game.state, this.state) < milestone.limit) {
			throw new Error("You haven't reached this milestone")
		}

		this.gameState.money -= MILESTONE_PRICE
		this.game.state.milestones.push({
			playerId: this.state.id,
			type
		})

		this.updated()
	}

	sponsorCompetition(type: CompetitionType) {
		if (!this.isPlaying) {
			throw new Error("You're not playing")
		}

		const sponsored = this.game.state.competitions.length
		if (sponsored >= COMPETITIONS_LIMIT) {
			throw new Error('All competitions are taken')
		}

		const cost = COMPETITIONS_PRICES[sponsored]

		if (this.gameState.money < cost) {
			throw new Error("You can't afford a competition")
		}

		if (this.game.state.competitions.find(c => c.type === type)) {
			throw new Error('This competition is already sponsored')
		}

		this.gameState.money -= cost
		this.game.state.competitions.push({
			playerId: this.state.id,
			type
		})

		this.updated()
	}
}
