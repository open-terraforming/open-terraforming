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
	CardType
} from '@shared/cards'
import {
	adjustedCardPrice,
	cellByCoords,
	emptyCardState,
	updatePlayerResource
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
import {
	GameStateValue,
	GridCell,
	GridCellContent,
	PlayerState,
	PlayerStateValue,
	StandardProjectType,
	VictoryPointsSource
} from '@shared/game'
import { Milestones, MilestoneType } from '@shared/milestones'
import { canPlace, isClaimable } from '@shared/placements'
import {
	placeTileAction,
	PlayerActionType,
	PlayerAction
} from '@shared/player-actions'
import { PlayerColors } from '@shared/player-colors'
import { Projects, StandardProject } from '@shared/projects'
import { initialPlayerState } from '@shared/states'
import {
	adjacentCells,
	allCells,
	drawCards,
	pushPendingAction,
	range,
	pendingActions
} from '@shared/utils'
import Hashids from 'hashids/cjs'
import { MyEvent } from '@/utils/events'
import { v4 as uuidv4 } from 'uuid'
import { Game } from './game'
import { validateArgValue } from './validation/validate-arg-value'

export interface CardPlayedEvent {
	player: Player
	card: Card
	cardIndex: number
}
export interface TilePlacedEvent {
	player: Player
	cell: GridCell
}

export interface ProjectBought {
	project: StandardProject
	player: Player
}

export class Player {
	static idCounter = 1

	get logger() {
		return new Logger(this.game.logger.category + ' ' + this.state.name)
	}

	state = initialPlayerState(Player.idCounter++, uuidv4())

	onStateChanged = new MyEvent<Readonly<PlayerState>>()
	onCardPlayed = new MyEvent<Readonly<CardPlayedEvent>>()
	onTilePlaced = new MyEvent<Readonly<TilePlacedEvent>>()
	onProjectBought = new MyEvent<Readonly<ProjectBought>>()

	game: Game

	get gameState() {
		return this.state.state
	}

	get corporation() {
		return CardsLookupApi.get(this.state.corporation)
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

	get pendingActions() {
		return pendingActions(this.state)
	}

	get pendingAction(): PlayerAction | undefined {
		return this.pendingActions[0]
	}

	constructor(game: Game) {
		this.game = game

		this.state.session = new Hashids(this.game.config.adminPassword, 5).encode(
			this.state.id
		)
	}

	toggleReady(ready: boolean) {
		if (this.game.state.state !== GameStateValue.WaitingForPlayers) {
			throw new Error("You can't change your state when playing")
		}

		this.state.state = ready ? PlayerStateValue.Ready : PlayerStateValue.Waiting

		this.updated()
	}

	popAction() {
		if (!this.pendingAction) {
			throw new Error("Trying to pop action when there aren't any")
		}

		this.state.pendingActions.shift()

		this.game.filterPendingActions()

		if (this.pendingActions.length === 0) {
			switch (this.game.state.state) {
				case GameStateValue.GenerationInProgress: {
					switch (this.state.state) {
						case PlayerStateValue.Playing: {
							this.actionPlayed()
							break
						}
					}

					break
				}

				case GameStateValue.Starting: {
					this.state.state = PlayerStateValue.WaitingForTurn
					break
				}

				case GameStateValue.GenerationStart: {
					this.state.state = PlayerStateValue.WaitingForTurn
					break
				}

				case GameStateValue.EndingTiles: {
					this.pass(true)
					break
				}
			}
		}

		this.updated()
	}

	pickCorporation(code: string) {
		const top = this.pendingAction

		if (top?.type !== PlayerActionType.PickCorporation) {
			throw new Error('You are not picking corporations right now')
		}

		if (!top.cards.includes(code)) {
			throw new Error(`This corporation wasn't in your options`)
		}

		const corp = CardsLookupApi.get(code)

		if (!corp || corp.type !== CardType.Corporation) {
			throw new Error(`Unknown corporation ${code}`)
		}

		this.logger.log(f('Picked corporation {0}', code))

		const card = emptyCardState(corp.code, this.state.usedCards.length)
		this.state.usedCards.push(card)
		this.state.corporation = card.code

		this.runCardEffects(
			corp.playEffects,
			{
				card,
				cardIndex: 0,
				game: this.game.state,
				player: this.state,
				playerId: this.state.id
			},
			[]
		)

		this.onCardPlayed.emit({ card: corp, cardIndex: -1, player: this })

		this.popAction()
	}

	pickPreludes(cards: number[]) {
		const top = this.pendingAction

		if (top?.type !== PlayerActionType.PickPreludes) {
			throw new Error('You are not picking preludes right now')
		}

		if (new Set(cards).size !== cards.length) {
			throw new Error('You cant pick one card twice')
		}

		if (cards.find(c => c >= top.cards.length || c < 0)) {
			throw new Error('Invalid list of cards to pick')
		}

		if (top.limit > 0) {
			if (cards.length !== top.limit) {
				throw new Error(`You have to pick ${cards.length} cards`)
			}
		}

		// Preludes can actually be unplayable under certain conditions
		cards
			.map(c => CardsLookupApi.get(top.cards[c]))
			.forEach(c =>
				this.checkCardConditions(
					c,
					{
						card: emptyCardState(c.code),
						cardIndex: -1,
						game: this.game.state,
						player: this.state,
						playerId: this.id
					},
					[]
				)
			)

		this.logger.log(
			f('Picked preludes: {0}', cards.map(c => top.cards[c]).join(', '))
		)

		const usedCards = cards.map((c, i) =>
			emptyCardState(top.cards[c], this.state.usedCards.length + i)
		)

		this.state.usedCards = [...this.state.usedCards, ...usedCards]

		this.game.state.preludeDiscarded = [
			...this.game.state.preludeDiscarded,
			...top.cards.filter((_c, i) => !cards.includes(i))
		]

		this.state.usedCards.forEach((c, i) => {
			if (usedCards.includes(c)) {
				const card = CardsLookupApi.get(c.code)

				this.runCardEffects(
					card.playEffects,
					{
						game: this.game.state,
						player: this.state,
						playerId: this.state.id,
						cardIndex: i,
						card: c
					},
					[]
				)
			}
		})

		this.popAction()
	}

	pickCards(cards: number[]) {
		const top = this.pendingAction

		if (top?.type !== PlayerActionType.PickCards) {
			throw new Error('You are not picking cards right now')
		}

		if (new Set(cards).size !== cards.length) {
			throw new Error('You cant pick one card twice')
		}

		if (cards.find(c => c >= top.cards.length || c < 0)) {
			throw new Error('Invalid list of cards to pick')
		}

		if (top.limit > 0) {
			if (cards.length !== top.limit) {
				throw new Error(`You have to pick ${cards.length} cards`)
			}
		}

		if (!top.free) {
			if (cards.length * CARD_PRICE > this.state.money) {
				throw new Error("You don't have money for that")
			}

			this.state.money -= cards.length * CARD_PRICE
		}

		this.logger.log(
			f('Picked cards: {0}', cards.map(c => top.cards[c]).join(', '))
		)

		this.state.cards = [...this.state.cards, ...cards.map(c => top.cards[c])]

		this.game.state.discarded.push(
			...top.cards.filter((_c, i) => !cards.includes(i))
		)

		this.popAction()
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

		if (this.pendingAction) {
			throw new Error("You've got pending actions to attend to")
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

		const cardState = emptyCardState(cardCode, this.state.usedCards.length)

		const ctx = {
			player: this.state,
			playerId: this.id,
			game: this.game.state,
			card: cardState,
			cardIndex: cardState.index
		}

		this.checkCardConditions(card, ctx, playArguments)

		this.logger.log(`Bought ${card.code} with`, JSON.stringify(playArguments))

		updatePlayerResource(this.state, 'money', -Math.max(0, cost))
		updatePlayerResource(this.state, 'titan', -useTitan)
		updatePlayerResource(this.state, 'ore', -useOre)

		this.runCardEffects(card.playEffects, ctx, playArguments)

		this.state.usedCards.push(cardState)
		this.state.cards.splice(index, 1)

		this.onCardPlayed.emit({
			card,
			cardIndex: ctx.cardIndex,
			player: this
		})

		this.game.checkMilestones()

		if (!this.pendingAction) {
			this.actionPlayed()
		}

		this.updated()
	}

	pickColor(index: number) {
		if (this.state.state !== PlayerStateValue.Waiting) {
			throw new Error(
				f(
					"You can't change your color now {0}",
					PlayerStateValue[this.state.state]
				)
			)
		}

		if (index < -1 || index >= PlayerColors.length) {
			throw new Error('Unknown color')
		}

		this.state.color = index >= 0 ? PlayerColors[index] : ''
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

					try {
						validateArgValue({
							a,
							card,
							ctx,
							value
						})
					} catch (e) {
						throw new Error(
							f('{0}: Effect {1} argument {2} - {3}', card.title, i, ai, e)
						)
					}
				})
			})
		}
	}

	placeTile(x: number, y: number) {
		if (!this.isPlaying && this.state.state !== PlayerStateValue.EndingTiles) {
			throw new Error('Player is not playing now')
		}

		const top = this.pendingAction

		if (top?.type !== PlayerActionType.PlaceTile) {
			throw new Error("You're not placing tiles right now")
		}

		const cell = cellByCoords(this.game.state, x, y)

		if (!cell) {
			throw new Error('Cell not found')
		}

		const pendingTile = top.state

		if (!canPlace(this.game.state, this.state, cell, pendingTile)) {
			throw new Error(`You cannot place the tile here`)
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
		updatePlayerResource(this.state, 'heat', cell.heat)
		updatePlayerResource(this.state, 'money', cell.money)

		if (cell.cards > 0) {
			this.state.cards.push(...drawCards(this.game.state, cell.cards))
		}

		if (
			cell.oceans > 0 &&
			this.game.state.oceans < this.game.state.map.oceans
		) {
			pushPendingAction(
				this.state,
				placeTileAction({ type: GridCellContent.Ocean })
			)
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

		this.onTilePlaced.emit({
			cell,
			player: this
		})

		this.game.checkMilestones()

		// Make sure player spent all his plants in ending phase
		if (this.state.state == PlayerStateValue.EndingTiles) {
			this.buyAllGreeneries()
		}

		this.popAction()
	}

	buyAllGreeneries() {
		range(0, Math.floor(this.state.plants / this.state.greeneryCost)).forEach(
			() => {
				pushPendingAction(
					this.state,
					placeTileAction({ type: GridCellContent.Forest })
				)

				this.state.plants -= this.state.greeneryCost
			}
		)
	}

	runCardEffects(
		effects: CardEffect[],
		ctx: CardCallbackContext,
		playArguments: CardEffectArgumentType[][]
	) {
		effects.forEach((e, i) => {
			e.perform(ctx, ...(playArguments[i] || []))
		})

		this.filterPendingActions()
	}

	actionPlayed() {
		this.state.actionsPlayed++

		if (this.state.actionsPlayed >= 2) {
			this.state.state = PlayerStateValue.WaitingForTurn
			this.updated()
		}
	}

	pass(force = false) {
		if (!this.isPlaying && this.state.state !== PlayerStateValue.EndingTiles) {
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

		this.updated()
	}

	updated() {
		this.logger.category = this.state.name
		this.onStateChanged.emit(this.state)
	}

	endGeneration() {
		const state = this.state

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
		const top = this.pendingAction

		if (
			top !== undefined &&
			(top.type !== PlayerActionType.PlayCard || top.cardIndex !== index)
		) {
			throw new Error("You've got pending actions to attend to")
		}

		if (top === undefined && !this.isPlaying) {
			throw new Error("You're not playing")
		}

		const cardState = this.state.usedCards[index]

		if (cardState === undefined || cardState?.code !== cardCode) {
			throw new Error(
				f(
					'Something is wrong, incorrect card index and card type combination {0}/{1}',
					cardCode,
					index
				)
			)
		}

		if (cardState.played) {
			throw new Error(`${cardCode} was already played this generation`)
		}

		const card = CardsLookupApi.get(cardCode)

		if (!card) {
			throw new Error(`Unknown card ${cardCode}`)
		}

		if (
			top === undefined &&
			card.type !== CardType.Action &&
			card.type !== CardType.Corporation
		) {
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

		this.logger.log(`Played ${card.code} with`, JSON.stringify(playArguments))

		this.runCardEffects(card.actionEffects, ctx, playArguments)

		this.game.checkMilestones()

		if (top) {
			this.popAction()
		} else {
			if (card.type !== CardType.Corporation) {
				cardState.played = true
			}

			if (!this.pendingAction) {
				this.actionPlayed()
			}

			this.updated()
		}
	}

	claimTile(x: number, y: number) {
		if (!this.isPlaying) {
			throw new Error('Player is not playing now')
		}

		const top = this.pendingAction

		if (top?.type !== PlayerActionType.ClaimTile) {
			throw new Error("You're not claiming now")
		}

		const cell = cellByCoords(this.game.state, x, y)

		if (!cell) {
			throw new Error('Cell not found')
		}

		if (!isClaimable(cell)) {
			throw new Error(`This cell is reserved or owned by someone else`)
		}

		this.logger.log(f('Claimed {0},{1}', cell.x, cell.y))

		cell.claimantId = this.state.id

		this.popAction()
	}

	filterPendingActions() {
		this.state.pendingActions = this.state.pendingActions.filter(p => {
			if (p.type !== PlayerActionType.PlaceTile) {
				return true
			}

			if (p.state.type === GridCellContent.Ocean) {
				return this.game.state.oceans < this.game.state.map.oceans
			}

			return (
				allCells(this.game.state).find(c =>
					canPlace(this.game.state, this.state, c, p.state)
				) !== undefined
			)
		})
	}

	finishGame() {
		this.state.victoryPoints.push({
			source: VictoryPointsSource.Rating,
			amount: this.state.terraformRating
		})

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

		const tileVps = allCells(this.game.state).reduce(
			(acc, cell) => {
				if (cell.ownerId === this.id) {
					switch (cell.content) {
						case GridCellContent.Forest: {
							acc.forests += 1
							break
						}

						case GridCellContent.City: {
							acc.cities += adjacentCells(
								this.game.state,
								cell.x,
								cell.y
							).filter(c => c.content === GridCellContent.Forest).length

							break
						}
					}
				}

				return acc
			},
			{ forests: 0, cities: 0 }
		)

		this.game.state.milestones
			.filter(m => m.playerId === this.state.id)
			.forEach(m => {
				this.state.victoryPoints.push({
					source: VictoryPointsSource.Milestones,
					amount: MILESTONE_REWARD,
					milestone: m.type
				})
			})

		this.state.victoryPoints.push({
			source: VictoryPointsSource.Cards,
			amount: cardVps
		})

		this.state.victoryPoints.push({
			source: VictoryPointsSource.Forests,
			amount: tileVps.forests
		})

		this.state.victoryPoints.push({
			source: VictoryPointsSource.Cities,
			amount: tileVps.cities
		})
	}

	buyStandardProject(projectType: StandardProjectType, cards: number[]) {
		if (!this.isPlaying) {
			throw new Error("You're not playing")
		}

		if (this.pendingAction) {
			throw new Error("You've got pending actions to attend to")
		}

		const project = Projects[projectType]

		const ctx = {
			game: this.game.state,
			player: this.state
		}

		if (!project.conditions.every(c => c(ctx))) {
			throw new Error(`You cannot execute ${StandardProjectType[projectType]}`)
		}

		updatePlayerResource(this.state, project.resource, -project.cost(ctx))
		project.execute(ctx, cards)

		this.logger.log(
			f('Bought standard project {0}', StandardProjectType[projectType])
		)

		this.onProjectBought.emit({
			player: this,
			project
		})

		this.game.checkMilestones()

		if (!this.pendingAction) {
			this.actionPlayed()
		}

		this.updated()
	}

	buyMilestone(type: MilestoneType) {
		if (!this.isPlaying) {
			throw new Error("You're not playing")
		}

		if (this.pendingAction) {
			throw new Error("You've got pending actions to attend to")
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

		const top = this.pendingAction

		if (top) {
			if (top.type !== PlayerActionType.SponsorCompetition) {
				throw new Error("You've got pending actions to attend to.")
			}
		} else {
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

			updatePlayerResource(this.state, 'money', -cost)
		}

		this.logger.log(f('Sponsored {0} competition', CompetitionType[type]))

		this.game.state.competitions.push({
			playerId: this.state.id,
			type
		})

		if (top) {
			this.popAction()
		} else {
			this.actionPlayed()
			this.updated()
		}
	}

	adminLogin(password: string) {
		if (this.game.config.adminPassword !== password) {
			throw new Error('Invalid admin password')
		}

		this.logger.log('Logged in as admin')

		this.state.admin = true
	}
}
