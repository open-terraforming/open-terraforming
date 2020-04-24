import { shuffle } from '@/utils/collections'
import {
	CardCategory,
	CardEffect,
	CardEffectArgumentType,
	CardEffectTarget,
	CardsLookupApi,
	Resource
} from '@shared/cards'
import {
	emptyCardState,
	isCardActionable,
	isCardPlayable,
	minimalCardPrice
} from '@shared/cards/utils'
import { Competitions } from '@shared/competitions'
import {
	CARD_PRICE,
	COMPETITIONS_LIMIT,
	MILESTONES_LIMIT
} from '@shared/constants'
import {
	PlayerStateValue,
	StandardProjectType,
	UsedCardState,
	GameStateValue
} from '@shared/game'
import { Milestones } from '@shared/milestones'
import { canPlace, isClaimable } from '@shared/placements'
import { PlayerAction, PlayerActionType } from '@shared/player-actions'
import { Projects } from '@shared/projects'
import { allCells, competitionPrice, milestonePrice } from '@shared/utils'
import { Game } from './game'
import { Player } from './player'
import { placeTileScore } from './scoring/place-tile-score'
import { ScoringContext } from './scoring/types'
import { pickBest } from './scoring/utils'
import { claimTileScore } from './scoring/claim-tile-score'
import { standardProjectScore } from './scoring/standard-project-score'

const BotNames = [
	'Rick',
	'Jon',
	'Joana',
	'James',
	'Jack',
	'Oprah',
	'Trump',
	'Lin',
	'Sarah',
	'Bojack',
	'Horse',
	'Theodor',
	'Pierre',
	'Keren',
	'Sanders',
	'Babish',
	'Robert',
	'Sir',
	'China',
	'Europe',
	'Fredrick',
	'Harry'
]

let names = [] as string[]
const pickBotName = (id: number) => {
	if (names.length === 0) {
		names = shuffle(BotNames)
	}

	return names.pop() || `Bot ${id}`
}

export class Bot extends Player {
	doing?: ReturnType<typeof setTimeout>

	constructor(game: Game) {
		super(game)

		this.state.name = pickBotName(this.state.id)
		this.state.connected = true
		this.state.bot = true
		this.state.state = PlayerStateValue.Ready

		this.game.onStateUpdated.on(() => this.updated(false))
	}

	get cards() {
		return this.state.cards.map(c => CardsLookupApi.get(c))
	}

	updated(broadcast = true) {
		if (!this.doing) {
			this.doing = setTimeout(() => {
				this.doing = undefined
				try {
					this.doSomething()
				} catch (e) {
					this.logger.log('Bot failed:')
					this.logger.error(e)
					try {
						this.pass()
					} catch (e) {
						this.logger.error('Unable to pass', e)
					}
				}
			}, 2000 + Math.random() * 5000)
		}

		if (broadcast) {
			super.updated()
		}
	}

	prepareParams(
		effects: CardEffect[],
		card: UsedCardState,
		cardIndex: number
	): CardEffectArgumentType[][] {
		return effects.map(e =>
			e.args.map(a => {
				switch (a.type) {
					case CardEffectTarget.Card: {
						const card = shuffle(
							a.fromHand
								? this.state.cards
										.filter(
											(card, cardIndex) =>
												!a.cardConditions.find(
													c =>
														!c.evaluate({
															card: emptyCardState(card),
															cardIndex,
															game: this.game.state,
															player: this.state,
															playerId: this.id
														})
												)
										)
										.map(c => this.state.cards.indexOf(c))
								: this.state.usedCards
										.filter(
											(card, cardIndex) =>
												!a.cardConditions.find(
													c =>
														!c.evaluate({
															card,
															cardIndex,
															game: this.game.state,
															player: this.state,
															playerId: this.id
														})
												)
										)
										.map(c => this.state.usedCards.indexOf(c))
						)[0]

						return card as number
					}
					case CardEffectTarget.Player: {
						const player = shuffle(
							this.game.state.players.filter(
								player =>
									player.id !== this.id &&
									!a.playerConditions.find(
										c =>
											!c.evaluate({
												game: this.game.state,
												player: player,
												card
											})
									)
							)
						)[0]

						return player?.id as number
					}
					case CardEffectTarget.PlayerResource: {
						const player = shuffle(
							this.game.state.players.filter(
								player =>
									player.id !== this.id &&
									!a.playerConditions.find(
										c =>
											!c.evaluate({
												game: this.game.state,
												player: player,
												card
											})
									)
							)
						)[0]

						if (player) {
							return [
								player.id,
								Math.min(player[a.resource as Resource], a.maxAmount as number)
							]
						}

						return [-1, 0]
					}
					case CardEffectTarget.PlayerCardResource: {
						const player = shuffle(
							this.game.state.players
								.filter(player => player.id !== this.id)
								.map(player => ({
									player,
									cards: shuffle(
										player.usedCards
											.filter(
												(card, cardIndex) =>
													!a.cardConditions.find(
														c =>
															!c.evaluate({
																card,
																cardIndex,
																game: this.game.state,
																player: player,
																playerId: player.id
															})
													)
											)
											.map(c => player.usedCards.indexOf(c))
									)
								}))
								.filter(({ cards }) => cards.length > 0)
						)[0]

						if (player) {
							return [player.player.id, player.cards[0]]
						}

						return [-1, 0]
					}
					case CardEffectTarget.Resource: {
						return this.state[a.resource as Resource]
					}
					case CardEffectTarget.EffectChoice: {
						const effect = shuffle(
							(a.effects || [])
								.filter(
									e =>
										!e.conditions.find(
											c =>
												!c.evaluate({
													card,
													cardIndex,
													game: this.game.state,
													player: this.state,
													playerId: this.id
												})
										)
								)
								.map(e => a.effects?.indexOf(e))
						)[0]

						if (effect !== undefined && a.effects) {
							return [
								effect,
								this.prepareParams(
									[a.effects[effect]],
									card,
									cardIndex
								)[0] as CardEffectArgumentType[]
							]
						}

						return [-1, []]
					}
					default:
						return -1
				}
			})
		)
	}

	get scoringContext(): ScoringContext {
		return {
			game: this.game.state,
			player: this.state
		}
	}

	performPending(a: PlayerAction) {
		switch (a.type) {
			case PlayerActionType.PickCorporation: {
				return this.pickCorporation(shuffle(a.cards.slice(0))[0])
			}

			case PlayerActionType.PickCards: {
				const picked = a.free
					? shuffle(a.cards.map((_c, i) => i)).slice(
							0,
							a.limit || a.cards.length
					  )
					: shuffle(a.cards.map((_c, i) => i)).slice(
							0,
							Math.max(
								0,
								Math.floor(
									((this.state.money *
										(this.game.state.state === GameStateValue.Starting
											? 0.8
											: 0.3)) /
										CARD_PRICE) *
										(0.6 + 0.4 * Math.random())
								)
							)
					  )

				return this.pickCards(picked)
			}

			case PlayerActionType.PickPreludes: {
				const picked = shuffle(
					a.cards.map((c, i) => [CardsLookupApi.get(c), i] as const)
				)
					.filter(([c]) =>
						isCardPlayable(c, {
							card: emptyCardState(c.code),
							cardIndex: -1,
							game: this.game.state,
							player: this.state,
							playerId: this.state.id
						})
					)
					.map(([, i]) => i)
					.slice(0, a.limit)

				return this.pickPreludes(picked)
			}

			case PlayerActionType.PlaceTile: {
				const placed = a.state
				const tile = pickBest(
					allCells(this.game.state).filter(c =>
						canPlace(this.game.state, this.state, c, placed)
					),
					c => placeTileScore(this.scoringContext, placed, c)
				)

				if (tile) {
					return this.placeTile(tile.x, tile.y)
				} else {
					return this.pass(true)
				}
			}

			case PlayerActionType.ClaimTile: {
				const tile = pickBest(
					allCells(this.game.state).filter(c => isClaimable(c)),
					c => claimTileScore(this.scoringContext, c)
				)

				if (tile) {
					return this.claimTile(tile.x, tile.y)
				} else {
					return this.pass(true)
				}
			}

			case PlayerActionType.PlayCard: {
				const card = this.state.usedCards[a.cardIndex]

				return this.playCard(
					card.code,
					a.cardIndex,
					this.prepareParams(
						CardsLookupApi.get(card.code).actionEffects,
						card,
						a.cardIndex
					)
				)
			}

			case PlayerActionType.SponsorCompetition: {
				const comp = shuffle(
					this.game.state.map.competitions
						.map(c => Competitions[c])
						.filter(
							c => !this.game.state.competitions.find(b => b.type === c.type)
						)
				)[0]

				if (comp) {
					return this.sponsorCompetition(comp.type)
				} else {
					return this.pass(true)
				}
			}
		}
	}

	doSomething() {
		const actions = [] as [number, () => void][]

		switch (this.state.state) {
			case PlayerStateValue.Waiting: {
				actions.push([0, () => this.toggleReady(true)])
				break
			}

			case PlayerStateValue.Picking: {
				const pending = this.pendingAction
				if (pending) {
					actions.push([0, () => this.performPending(pending)])
				} else {
					this.logger.error('Nothing to do, yet I have to pick something...')
				}
				break
			}

			case PlayerStateValue.EndingTiles: {
				const placed = this.pendingAction
				if (placed && placed.type === PlayerActionType.PlaceTile) {
					const tile = pickBest(
						allCells(this.game.state).filter(c =>
							canPlace(this.game.state, this.state, c, placed.state)
						),
						c => placeTileScore(this.scoringContext, placed.state, c)
					)

					if (tile) {
						actions.push([0, () => this.placeTile(tile.x, tile.y)])
					}
				}
				break
			}

			case PlayerStateValue.Playing: {
				const pending = this.pendingAction

				if (pending) {
					actions.push([0, () => this.performPending(pending)])
				} else {
					if (this.game.state.milestones.length < MILESTONES_LIMIT) {
						Object.values(Milestones)
							.filter(
								m => !this.game.state.milestones.find(s => s.type === m.type)
							)
							.forEach(m => {
								if (
									this.state.money >= milestonePrice() &&
									m.getValue(this.game.state, this.state) >= m.limit
								) {
									actions.push([
										10,
										() => {
											this.buyMilestone(m.type)
										}
									])
								}
							})
					}

					if (this.game.state.competitions.length < COMPETITIONS_LIMIT) {
						Object.values(Competitions)
							.filter(
								m => !this.game.state.competitions.find(s => s.type === m.type)
							)
							.forEach(c => {
								if (
									this.state.money >= competitionPrice(this.game.state) &&
									c.getScore(this.game.state, this.state) >
										this.game.state.players
											.filter(p => p.id !== this.id)
											.reduce((m, p) => {
												const s = c.getScore(this.game.state, p)
												return s > m ? s : m
											}, 0) &&
									this.game.state.generation > 5
								) {
									actions.push([
										0,
										() => {
											this.sponsorCompetition(c.type)
										}
									])
								}
							})
					}

					Object.values(Projects).forEach(p => {
						if (
							p.conditions.every(c =>
								c({ game: this.game.state, player: this.state })
							)
						) {
							if (p.type !== StandardProjectType.SellPatents) {
								actions.push([
									standardProjectScore(this.scoringContext, p),
									() => {
										this.buyStandardProject(p.type, [])
									}
								])
							}
						}
					})

					this.cards
						.filter(
							c =>
								isCardPlayable(c, {
									card: emptyCardState(c.code),
									cardIndex: -1,
									game: this.game.state,
									player: this.state,
									playerId: this.state.id
								}) && minimalCardPrice(c, this.state) <= this.state.money
						)
						.forEach(c => {
							actions.push([
								1,
								() => {
									const card = CardsLookupApi.get(c.code)

									this.buyCard(
										c.code,
										this.state.cards.indexOf(c.code),
										card.categories.includes(CardCategory.Building)
											? this.state.ore
											: 0,
										card.categories.includes(CardCategory.Space)
											? this.state.titan
											: 0,
										this.prepareParams(
											card.playEffects,
											emptyCardState(c.code),
											-1
										)
									)
								}
							])
						})

					this.state.usedCards
						.filter(
							(c, i) =>
								CardsLookupApi.get(c.code).actionEffects.length > 0 &&
								isCardActionable(CardsLookupApi.get(c.code), {
									card: c,
									cardIndex: i,
									game: this.game.state,
									player: this.state,
									playerId: this.state.id
								})
						)
						.forEach(c => {
							actions.push([
								0,
								() => {
									const cardIndex = this.state.usedCards.indexOf(c) as number

									this.playCard(
										c.code,
										cardIndex,
										this.prepareParams(
											CardsLookupApi.get(c.code).actionEffects,
											c,
											cardIndex
										)
									)
								}
							])
						})
				}

				break
			}
		}

		if (actions.length === 0) {
			if (this.isPlaying) {
				this.pass()
			}
		} else {
			const sorted = actions.sort(([a], [b]) => b - a)

			shuffle(sorted.filter(s => s[0] === sorted[0][0]))[0][1]()
		}
	}
}
