import { Logger } from '@/utils/log'
import { f } from '@/utils/string'
import {
	Card,
	CardCallbackContext,
	CardCategory,
	CardCondition,
	CardEffect,
	CardEffectArgumentType,
	CardsLookupApi,
	CardType,
	CardEffectTarget
} from '@shared/cards'
import {
	adjustedCardPrice,
	cellByCoords,
	updatePlayerResource,
	emptyCardState,
	gamePlayer
} from '@shared/cards/utils'
import { CompetitionType } from '@shared/competitions'
import {
	CARD_PRICE,
	COMPETITIONS_LIMIT,
	COMPETITIONS_PRICES,
	MILESTONES_LIMIT,
	MILESTONE_PRICE,
	MILESTONE_REWARD
} from '@shared/constants'
import { Corporations } from '@shared/corporations'
import {
	GameStateValue,
	GridCell,
	GridCellContent,
	GridCellSpecial,
	PlayerState,
	PlayerStateValue,
	StandardProjectType,
	UsedCardState
} from '@shared/game'
import { Milestones, MilestoneType } from '@shared/milestones'
import { canPlace, PlacementConditionsLookup } from '@shared/placements'
import { Projects } from '@shared/projects'
import { initialPlayerState } from '@shared/states'
import { adjacentCells, allCells, drawCards } from '@shared/utils'
import { MyEvent } from 'src/utils/events'
import { v4 as uuidv4 } from 'uuid'
import { Game } from './game'

export interface CardPlayedEvent {
	player: Player
	card: Card
	cardIndex: number
}
export interface TilePlacedEvent {
	player: Player
	cell: GridCell
}

export class Player {
	static idCounter = 1

	logger = new Logger('Player')

	state = initialPlayerState(Player.idCounter++, uuidv4())
	admin = false

	onStateChanged = new MyEvent<Readonly<PlayerState>>()
	onCardPlayed = new MyEvent<Readonly<CardPlayedEvent>>()
	onTilePlaced = new MyEvent<Readonly<TilePlacedEvent>>()

	game: Game

	get gameState() {
		return this.state.state
	}

	get corporation() {
		return Corporations.find(c => c.code === this.state.corporation)
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
		return this.state.actionsPlayed
	}

	set actionsPlayer(number: number) {
		this.state.actionsPlayed = number
	}

	get isPlaying() {
		return (
			this.game.currentPlayer.id === this.id &&
			this.state.state === PlayerStateValue.Playing
		)
	}

	constructor(game: Game) {
		this.game = game
	}

	setState(state: PlayerStateValue) {
		switch (state) {
			case PlayerStateValue.Ready: {
				if (this.game.state.state === GameStateValue.WaitingForPlayers) {
					this.state.state = state
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
					this.state.state = state
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
		if (this.state.state !== PlayerStateValue.PickingCorporation) {
			throw new Error('You are not picking corporations right now')
		}

		const corp = Corporations.find(c => c.code === code)
		if (!corp) {
			throw new Error(`Unknown corporation ${code}`)
		}

		this.logger.log(f('Picked corporation {0}', code))

		this.state.corporation = code

		this.state.money = corp.startingMoney
		this.state.ore = corp.startingOre
		this.state.plants = corp.startingPlants
		this.state.titan = corp.startingTitan
		this.state.heat = corp.startingHeat
		this.state.energy = corp.startingEnergy

		if (corp.startingCards > 0) {
			this.state.cards.push(...drawCards(this.game.state, corp.startingCards))
		}

		if (corp.pickingCards) {
			this.giveCards(10)
			this.state.state = PlayerStateValue.PickingCards
		} else {
			this.state.state = PlayerStateValue.WaitingForTurn
		}

		this.updated()
	}

	pickCards(cards: number[]) {
		if (this.state.state !== PlayerStateValue.PickingCards) {
			throw new Error('You are not picking cards right now')
		}

		if (new Set(cards).size !== cards.length) {
			throw new Error('You cant pick one card twice')
		}

		if (cards.find(c => c >= this.state.cardsPick.length || c < 0)) {
			throw new Error('Invalid list of cards to pick')
		}

		if (this.state.cardsPickLimit > 0) {
			if (cards.length !== this.state.cardsPickLimit) {
				throw new Error(`You have to pick ${cards.length} cards`)
			}
		}

		if (!this.state.cardsPickFree) {
			if (cards.length * CARD_PRICE > this.state.money) {
				throw new Error("You don't have money for that")
			}

			this.state.money -= cards.length * CARD_PRICE
		}

		this.logger.log(
			f('Picked cards: {0}', cards.map(c => this.state.cardsPick[c]).join(', '))
		)

		this.state.cards = [
			...this.state.cards,
			...cards.map(c => this.state.cardsPick[c])
		]

		this.game.state.discarded.push(
			...this.state.cardsPick.filter((_c, i) => !cards.includes(i))
		)

		this.state.cardsPick = []
		this.state.cardsPickFree = false
		this.state.cardsPickLimit = 0

		switch (this.game.state.state) {
			case GameStateValue.PickingCorporations:
			case GameStateValue.PickingCards: {
				this.state.state = PlayerStateValue.WaitingForTurn
				break
			}

			case GameStateValue.GenerationInProgress: {
				this.state.state = PlayerStateValue.Playing
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

		if (this.state.cards[index] !== cardCode) {
			throw new Error(
				'Something is wrong, incorrect card index and card type combination'
			)
		}

		const card = CardsLookupApi.get(cardCode)

		if (!card) {
			throw new Error(`Unknown card ${cardCode}`)
		}

		let cost = adjustedCardPrice(card, this.state)

		if (useOre > 0) {
			if (!card.categories.includes(CardCategory.Building)) {
				throw new Error('You can only use ore to pay for buildings')
			}

			if (useOre > this.state.ore) {
				throw new Error("You don't have that much ore")
			}

			useOre = Math.min(useOre, Math.ceil(cost / this.state.orePrice))
			cost -= useOre * this.state.orePrice
		}

		if (useTitan > 0) {
			if (!card.categories.includes(CardCategory.Space)) {
				throw new Error('You can only use titan to pay for space cards')
			}

			if (useTitan > this.state.titan) {
				throw new Error("You don't have that much titan")
			}

			useTitan = Math.min(useTitan, Math.ceil(cost / this.state.titanPrice))
			cost -= useTitan * this.state.titanPrice
		}

		if (this.state.money < cost) {
			throw new Error(
				`You don't have money for that, adjusted price was ${cost}.`
			)
		}

		const cardState: UsedCardState = {
			code: cardCode,
			animals: 0,
			microbes: 0,
			played: false,
			science: 0,
			fighters: 0
		}

		const ctx = {
			player: this.state,
			playerId: this.id,
			game: this.game.state,
			card: cardState,
			cardIndex: this.state.usedCards.length
		}

		this.checkCardConditions(card, ctx, playArguments)

		this.logger.log(`Bought ${card.code} with`, playArguments)

		updatePlayerResource(this.state, 'money', -Math.max(0, cost))
		updatePlayerResource(this.state, 'titan', -useTitan)
		updatePlayerResource(this.state, 'ore', -useOre)

		card.playEffects.forEach((e, i) => {
			// Make sure arguments exist
			if (!playArguments[i]) {
				playArguments[i] = []
			}

			e.args.forEach((_a, ai) => {
				if (playArguments[i][ai] === undefined) {
					throw new Error(
						`Argument #${ai} of playEffect ${i} (${e.description}) is missing`
					)
				}
			})

			e.perform(ctx, ...(playArguments[i] || []))
		})

		this.state.usedCards.push(cardState)
		this.state.cards.splice(index, 1)

		this.onCardPlayed.emit({
			card,
			cardIndex: ctx.cardIndex,
			player: this
		})

		if (
			this.state.placingTile.length === 0 &&
			this.state.state !== PlayerStateValue.PickingCards
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
			...(action ? [] : card.conditions.filter(c => !c.evaluate(ctx))),
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
					.map((c, i) => c.description || i.toString())
					.join('. ')}`
			)
		}

		if (action) {
			card.actionEffects.forEach((e, i) => {
				if (!playArguments[i]) {
					playArguments[i] = []
				}

				// TODO: More checks
				e.args.forEach((a, ai) => {
					const value = playArguments[i][ai]

					if (value === undefined) {
						throw new Error(
							`${card.code}: No value specified for effect ${i} argument ${ai}`
						)
					}

					// Check if card is valid
					if (a.type === CardEffectTarget.Card) {
						const card = a.fromHand
							? emptyCardState(this.state.cards[value as number])
							: this.state.usedCards[value as number]

						const errors = a.cardConditions.filter(
							c =>
								!c.evaluate({
									card,
									cardIndex: value as number,
									player: this.state,
									game: this.game.state,
									playerId: this.state.id
								})
						)

						if (errors.length > 0) {
							throw new Error(
								f(
									`{0}: Card selected for effect {1} argument {2} doesn't meet the conditions: {3}`,
									card.code,
									i,
									ai,
									errors.map((e, i) => e.description || i.toString()).join(', ')
								)
							)
						}
					}

					// Check if player is valid
					if (a.type === CardEffectTarget.Player) {
						if (value === -1 && !a.optional) {
							throw new Error(
								f(
									`{0}: Effect {1} argument {2}: player is required`,
									card.code,
									i,
									ai
								)
							)
						}

						const player = gamePlayer(this.game.state, value as number)

						const errors = a.playerConditions.filter(
							c =>
								!c.evaluate({
									game: this.game.state,
									player
								})
						)

						if (errors.length > 0) {
							throw new Error(
								f(
									`{0}: Player selected for effect {1} argument {2} doesn't meet the conditions: {3}`,
									card.code,
									i,
									ai,
									errors.map((e, i) => e.description || i.toString()).join(', ')
								)
							)
						}
					}
				})

				e.perform(ctx, ...(playArguments[i] || []))
			})
		}
	}

	giveCards(count: number) {
		this.state.cardsPick = drawCards(
			this.game.state,
			Math.min(
				this.game.state.cards.length + this.game.state.discarded.length,
				count
			)
		)
	}

	placeTile(x: number, y: number) {
		if (!this.isPlaying) {
			throw new Error('Player is not playing now')
		}

		const pendingTile = this.state.placingTile[0]

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
							player: this.state,
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

		this.logger.log(
			f(
				'Placed {0} at {1},{2}',
				GridCellContent[pendingTile.type],
				cell.x,
				cell.y
			)
		)

		cell.content = pendingTile.type
		cell.other = pendingTile.other
		cell.ownerCard = pendingTile.ownerCard
		cell.ownerId = this.state.id

		updatePlayerResource(this.state, 'ore', cell.ore)
		updatePlayerResource(this.state, 'titan', cell.titan)
		updatePlayerResource(this.state, 'plants', cell.plants)

		if (cell.cards > 0) {
			this.state.cards.push(...drawCards(this.game.state, cell.cards))
		}

		switch (pendingTile.type) {
			case GridCellContent.Forest: {
				if (this.game.state.oxygen < this.game.state.map.oxygen) {
					this.game.state.oxygen++
					this.state.terraformRating++
				}
				break
			}
			case GridCellContent.Ocean: {
				this.state.terraformRating++
				this.game.state.oceans++
				break
			}
		}

		this.state.money +=
			adjacentCells(this.game.state, cell.x, cell.y).filter(
				c => c.content === GridCellContent.Ocean
			).length * 2

		this.state.placingTile.shift()

		this.onTilePlaced.emit({
			cell,
			player: this
		})

		this.checkTilePlacement()

		if (this.state.placingTile.length === 0) {
			this.state.state = PlayerStateValue.Playing
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
			e.perform(ctx, ...(playArguments[i] || []))
		})

		this.checkTilePlacement()
	}

	actionPlayed() {
		this.state.actionsPlayed++

		if (this.state.actionsPlayed >= 2) {
			this.state.state = PlayerStateValue.WaitingForTurn
			this.game.nextPlayer()
			this.game.updated()
		}
	}

	pass(force = false) {
		if (!this.isPlaying) {
			throw new Error("You're not playing")
		}

		this.logger.log('Passed forced:', force)

		// Force pass if everybody else passed
		if (
			this.game.state.players.every(
				p => p.id === this.id || p.state === PlayerStateValue.Passed
			)
		) {
			force = true
		}

		this.state.state =
			this.state.actionsPlayed === 0 || force
				? PlayerStateValue.Passed
				: PlayerStateValue.WaitingForTurn
		this.game.nextPlayer()
		this.game.updated()
	}

	updated() {
		this.logger.category = this.state.name
		this.onStateChanged.emit(this.state)
	}

	endGeneration() {
		const state = this.state

		// Perform production
		state.heat += state.energy + state.heatProduction
		state.energy += state.energyProduction
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
			this.state.cardsToPlay.length > 0 &&
			this.state.cardsToPlay[0] !== index
		) {
			throw new Error(
				'You have to resolve pending events before playing other cards'
			)
		}

		if (this.state.cardsToPlay.length === 0 && !this.isPlaying) {
			throw new Error("You're not playing")
		}

		const cardState = this.state.usedCards[index]

		if (cardState === undefined || cardState?.code !== cardCode) {
			throw new Error(
				'Something is wrong, incorrect card index and card type combination'
			)
		}

		if (cardState.played) {
			throw new Error(`${cardCode} was already played this generation`)
		}

		const card = CardsLookupApi.get(cardCode)

		if (!card) {
			throw new Error(`Unknown card ${cardCode}`)
		}

		if (this.state.cardsToPlay.length === 0 && card.type !== CardType.Action) {
			throw new Error(`${card.title} isn't playable`)
		}

		const ctx = {
			player: this.state,
			playerId: this.id,
			game: this.game.state,
			card: cardState,
			cardIndex: index
		}

		this.checkCardConditions(card, ctx, playArguments, true)

		this.logger.log(`Played ${card.code} with`, playArguments)

		this.runCardEffects(card.actionEffects, ctx, playArguments)

		if (this.state.cardsToPlay.length > 0) {
			this.state.cardsToPlay.shift()
		} else {
			cardState.played = true

			if (
				this.state.placingTile.length === 0 &&
				this.state.state !== PlayerStateValue.PickingCards
			) {
				this.actionPlayed()
			}
		}

		this.updated()
	}

	checkTilePlacement() {
		this.state.placingTile = this.state.placingTile.filter(
			t =>
				(t.type !== GridCellContent.Ocean ||
					this.game.state.oceans < this.game.state.map.oceans) &&
				!!allCells(this.game.state).find(c =>
					canPlace(this.game.state, this.state, c, t)
				)
		)
	}

	finishGame() {
		const cardVps = this.state.usedCards.reduce((acc, state, cardIndex) => {
			const card = CardsLookupApi.get(state.code)
			acc += card.victoryPoints
			if (card.victoryPointsCallback) {
				acc += card.victoryPointsCallback.compute({
					card: state,
					cardIndex,
					game: this.game.state,
					player: this.state,
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

		this.state.terraformRating += cardVps
		this.state.terraformRating += tileVps
		this.state.terraformRating += milestonesVps
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

		this.logger.log(
			f('Bought standard project {0}', StandardProjectType[projectType])
		)

		if (this.state.placingTile.length === 0) {
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

		if (this.state.money < MILESTONE_PRICE) {
			throw new Error("You can't afford a milestone")
		}

		if (this.game.state.milestones.find(c => c.type === type)) {
			throw new Error('This milestone is already owned')
		}

		const milestone = Milestones[type]

		if (milestone.getValue(this.game.state, this.state) < milestone.limit) {
			throw new Error("You haven't reached this milestone")
		}

		this.logger.log(f('Bought milestone {0}', MilestoneType[type]))

		updatePlayerResource(this.state, 'money', -MILESTONE_PRICE)
		this.game.state.milestones.push({
			playerId: this.state.id,
			type
		})

		this.actionPlayed()

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

		if (this.state.money < cost) {
			throw new Error("You can't afford a competition")
		}

		if (this.game.state.competitions.find(c => c.type === type)) {
			throw new Error('This competition is already sponsored')
		}

		this.logger.log(f('Sponsored {0} competition', CompetitionType[type]))

		updatePlayerResource(this.state, 'money', -cost)

		this.game.state.competitions.push({
			playerId: this.state.id,
			type
		})

		this.actionPlayed()

		this.updated()
	}

	adminLogin(password: string) {
		if (this.game.config.adminPassword !== password) {
			throw new Error('Invalid admin password')
		}

		this.logger.log('Logged in as admin')

		this.admin = true
	}
}
