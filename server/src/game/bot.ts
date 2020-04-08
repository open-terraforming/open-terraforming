import { Player } from './player'
import { PlayerStateValue, UsedCardState } from '@shared/game'
import { Game } from './game'
import { shuffle } from '@/utils/collections'
import { Corporations } from '@shared/corporations'
import { CARD_PRICE } from '@shared/constants'
import {
	CardsLookupApi,
	CardEffect,
	CardEffectArgument,
	CardEffectTarget,
	CardEffectArgumentType,
	Resource,
	CardCategory
} from '@shared/cards'
import {
	isCardPlayable,
	emptyCardState,
	isCardActionable,
	minimalCardPrice
} from '@shared/cards/utils'
import { allCells } from '@shared/utils'
import { canPlace } from '@shared/placements'

const BotNames = ['Rick', 'Jon', 'Joana', 'James', 'Jack', 'Oprah', 'Trump']

let names = [] as string[]
const pickBotName = () => {
	if (names.length === 0) {
		names = shuffle(BotNames)
	}

	return names.pop() || '<unnamed>'
}

export class Bot extends Player {
	doing?: ReturnType<typeof setTimeout>

	constructor(game: Game) {
		super(game)

		this.name = pickBotName()
		this.state.connected = true
		this.state.bot = true
		this.gameState.state = PlayerStateValue.Ready
		this.updated()

		this.game.onStateUpdated.on(() => this.updated(false))
	}

	get cards() {
		return this.gameState.cards.map(c => CardsLookupApi.get(c))
	}

	updated(broadcast = true) {
		if (!this.doing) {
			this.doing = setTimeout(() => {
				this.doing = undefined
				try {
					this.doSomething()
				} catch (e) {
					console.log('Bot failed:')
					console.error(e)
					this.pass()
				}
			}, 100) // 2000 + Math.random() * 5000
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
								? this.gameState.cards
										.filter(
											(card, cardIndex) =>
												!a.cardConditions.find(
													c =>
														!c.evaluate({
															card: emptyCardState(card),
															cardIndex,
															game: this.game.state,
															player: this.gameState,
															playerId: this.id
														})
												)
										)
										.map(c => this.gameState.cards.indexOf(c))
								: this.gameState.usedCards
										.filter(
											(card, cardIndex) =>
												!a.cardConditions.find(
													c =>
														!c.evaluate({
															card,
															cardIndex,
															game: this.game.state,
															player: this.gameState,
															playerId: this.id
														})
												)
										)
										.map(c => this.gameState.usedCards.indexOf(c))
						)[0]

						return card as number
					}
					case CardEffectTarget.Player: {
						const player = shuffle(
							this.game.players.filter(
								player =>
									!a.playerConditions.find(
										c =>
											!c.evaluate({
												game: this.game.state,
												player: player.gameState
											})
									)
							)
						)[0]

						return player?.id as number
					}
					case CardEffectTarget.PlayerResource: {
						const player = shuffle(
							this.game.players.filter(
								player =>
									!a.playerConditions.find(
										c =>
											!c.evaluate({
												game: this.game.state,
												player: player.gameState
											})
									)
							)
						)[0]

						if (player) {
							return [
								player.id,
								Math.min(
									player.gameState[a.resource as Resource],
									a.maxAmount as number
								)
							]
						}

						return [-1, 0]
					}
					case CardEffectTarget.PlayerCardResource: {
						const player = shuffle(
							this.game.players
								.map(player => ({
									player,
									cards: shuffle(
										player.gameState.usedCards
											.filter(
												(card, cardIndex) =>
													!a.cardConditions.find(
														c =>
															!c.evaluate({
																card,
																cardIndex,
																game: this.game.state,
																player: player.gameState,
																playerId: player.id
															})
													)
											)
											.map(c => player.gameState.usedCards.indexOf(c))
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
						return this.gameState[a.resource as Resource]
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
													player: this.gameState,
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

	doSomething() {
		switch (this.gameState.state) {
			case PlayerStateValue.Waiting: {
				this.setState(PlayerStateValue.Ready)
				break
			}

			case PlayerStateValue.PickingCorporation: {
				this.pickCorporation(Corporations[0].code)
				break
			}

			case PlayerStateValue.PickingCards: {
				const picked = this.gameState.cardsPickFree
					? shuffle(this.gameState.cardsPick.map((_c, i) => i)).slice(
							0,
							this.gameState.cardsPickLimit || this.gameState.cardsPick.length
					  )
					: shuffle(
							this.gameState.cardsPick
								.map((_c, i) => i)
								.filter(() => Math.random() > 0.5)
					  ).slice(
							0,
							Math.max(0, Math.floor(this.gameState.money / CARD_PRICE))
					  )

				this.pickCards(picked)
				break
			}

			case PlayerStateValue.Playing: {
				const placed = this.gameState.placingTile[0]
				const playing = this.gameState.cardsToPlay[0]

				if (playing) {
					const card = this.gameState.usedCards[playing]
					this.playCard(
						card.code,
						playing,
						this.prepareParams(
							CardsLookupApi.get(card.code).actionEffects,
							card,
							playing
						)
					)
				} else if (placed) {
					const placed = this.gameState.placingTile[0]
					const tile = shuffle(allCells(this.game.state)).find(c =>
						canPlace(this.game.state, this.state, c, placed)
					)
					if (tile) {
						this.placeTile(tile.x, tile.y)
					} else {
						this.pass(true)
					}
				} else {
					const playable = shuffle(
						this.cards.filter(
							c =>
								isCardPlayable(c, {
									card: emptyCardState(c.code),
									cardIndex: -1,
									game: this.game.state,
									player: this.state.gameState,
									playerId: this.state.id
								}) &&
								minimalCardPrice(c, this.gameState) <= this.gameState.money
						)
					)[0]

					if (!playable) {
						const usable = shuffle(
							this.gameState.usedCards.filter((c, i) =>
								isCardActionable(CardsLookupApi.get(c.code), {
									card: c,
									cardIndex: i,
									game: this.game.state,
									player: this.state.gameState,
									playerId: this.state.id
								})
							)
						)[0]

						if (!usable) {
							this.pass(true)
						} else {
							const cardIndex = this.gameState.usedCards.indexOf(
								usable
							) as number

							this.playCard(
								usable.code,
								cardIndex,
								this.prepareParams(
									CardsLookupApi.get(usable.code).actionEffects,
									usable,
									cardIndex
								)
							)
						}
					} else {
						const card = CardsLookupApi.get(playable.code)

						this.buyCard(
							playable.code,
							this.gameState.cards.indexOf(playable.code),
							card.categories.includes(CardCategory.Building)
								? this.gameState.ore
								: 0,
							card.categories.includes(CardCategory.Space)
								? this.gameState.titan
								: 0,
							this.prepareParams(
								card.playEffects,
								emptyCardState(playable.code),
								-1
							)
						)
					}
				}

				break
			}
		}
	}
}
