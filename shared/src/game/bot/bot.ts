import { CardCategory, CardsLookupApi } from '@shared/cards'
import {
	adjustedCardPrice,
	emptyCardState,
	isCardActionable,
	isCardPlayable,
	minimalCardPrice,
} from '@shared/cards/utils'
import { ColoniesLookupApi } from '@shared/ColoniesLookupApi'
import { Competitions, CompetitionType } from '@shared/competitions'
import {
	canBuildColony,
	canTradeWithColonyUsingResource,
} from '@shared/expansions/colonies/utils'
import { PlayerStateValue, StandardProjectType } from '@shared/gameState'
import {
	activateRulingPolicyActionRequest,
	addCardResource,
	addDelegateToPartyActionRequest,
	buildColony,
	buyCard,
	buyMilestone,
	buyStandardProject,
	changeColonyStep,
	claimTile,
	COLONY_TRADE_RESOURCES,
	discardCards,
	draftCard,
	pickCards,
	pickPreludes,
	pickStarting,
	placeTile,
	playCard,
	playerPass,
	playerReady,
	solarPhaseTerraform,
	sponsorCompetition,
	tradeWithColony,
} from '@shared/index'
import { Logger } from '@shared/lib/logger'
import { Milestones, MilestoneType } from '@shared/milestones'
import { canPlace, isClaimable } from '@shared/placements'
import { PlayerAction, PlayerActionType } from '@shared/player-actions'
import { Projects } from '@shared/projects'
import { getCommitteeParty, isOk } from '@shared/utils'
import { allCells } from '@shared/utils/allCells'
import { assertNever } from '@shared/utils/assertNever'
import { competitionPrice } from '@shared/utils/competitionPrice'
import { f } from '@shared/utils/f'
import { mapCards } from '@shared/utils/mapCards'
import { pickRandom } from '@shared/utils/pickRandom'
import { shuffle } from '@shared/utils/shuffle'
import { simulateCardEffects } from '@shared/utils/simulate-card-effects'
import { Game } from '../game'
import { Player } from '../player'
import { BotAction } from './botTypes'
import { activatePartyPolicyScore } from './scoring/activatePartyPolicyScore'
import { addDelegateToPartyScore } from './scoring/addDelegateToPartyScore'
import { buildColonyScore } from './scoring/buildColonyScore'
import { claimTileScore } from './scoring/claim-tile-score'
import { computeScore } from './scoring/computeScore'
import {
	AiScoringCoefficients,
	defaultScoringCoefficients,
} from './scoring/defaultScoringCoefficients'
import { getBestArgs } from './scoring/getBestArgs'
import { placeTileScore } from './scoring/place-tile-score'
import { playCardScore } from './scoring/play-card-score'
import { standardProjectScore } from './scoring/standard-project-score'
import { tradeWithColonyScore } from './scoring/tradeWithColonyScore'
import { ScoringContext } from './scoring/types'
import { useCardScore } from './scoring/use-card-score'
import { pickBest } from './scoring/utils'
import { getBestProjectArgs } from './scoring/args/getBestProjectArgs'

export type BotOptions = ReturnType<typeof defaultOptions>

const defaultOptions = () => ({
	fast: false,
	instant: false,
	debug: false,
})

const action = (
	description: string,
	score: number,
	perform: () => void,
): BotAction => ({
	description,
	score,
	perform,
})

export class Bot extends Player {
	stopped = false
	doing?: ReturnType<typeof setTimeout>

	private debugLogger?: Logger

	get debug() {
		if (this.options.debug) {
			if (this.debugLogger) {
				return this.debugLogger
			}

			return (this.debugLogger = this.game.logger.child(this.state.name))
		}

		return null
	}

	options: BotOptions

	scoring: AiScoringCoefficients

	constructor(game: Game, options: Partial<BotOptions> = {}) {
		super(game)

		this.scoring = defaultScoringCoefficients()

		this.options = {
			...defaultOptions(),
			...options,
		}

		this.state.name = game.pickBotName(this.state.id)
		this.state.connected = true
		this.state.bot = true
		this.state.state = PlayerStateValue.Ready

		this.game.onStateUpdated.on(() => this.updated(false))
	}

	get cards() {
		return this.state.cards.map((c) => CardsLookupApi.get(c))
	}

	stop() {
		this.stopped = true
	}

	updated(broadcast = true) {
		if (this.stopped) {
			return
		}

		if (!this.doing) {
			this.doing = setTimeout(
				() => {
					this.doing = undefined

					try {
						this.doSomething()
					} catch (e) {
						this.logger.log('Bot failed:')
						this.logger.error(e)

						try {
							this.performAction(playerPass(true))
						} catch (e) {
							this.logger.error('Unable to pass', e)
						}
					}
				},
				this.options.instant
					? 0
					: this.options.fast
						? 200
						: 2000 + Math.random() * 1000,
			)
		}

		if (broadcast) {
			super.updated()
		}
	}

	get scoringContext(): ScoringContext {
		return {
			scoring: this.scoring,
			game: this.game.state,
			player: this.state,
		}
	}

	performPending(a: PlayerAction) {
		switch (a.type) {
			case PlayerActionType.PickStarting: {
				// Pick preludes by score
				const pickedPreludes = a.preludes
					.map((c, i) => [CardsLookupApi.get(c), i] as const)
					// Only pick preludes that are playable (shouldn't matter, but just in case)
					.filter(([c]) =>
						isCardPlayable(c, {
							card: emptyCardState(c.code),
							game: this.game.state,
							player: this.state,
						}),
					)
					// Score the preludes
					.map(
						([c, i]) =>
							[playCardScore(this.scoringContext, c).score, i] as const,
					)
					// Pick the top [preludesLimit] preludes
					.sort(([a], [b]) => b - a)
					// Only indexes are used when picking preludes
					.map(([, i]) => i)
					.slice(0, a.preludesLimit)

				// Corporation can be pretty much random right now
				const corporation = shuffle(a.corporations.slice())[0]

				// Detect how much money will player have to spend on cards
				const { player: simulatedPlayer } = simulateCardEffects(
					corporation,
					CardsLookupApi.get(corporation).playEffects,
				)

				// Bot should spend 50% of his money on cards tops
				const maxMoneySpentOnCards =
					simulatedPlayer.money * this.scoring.starting.maxCardsCost

				// Randomize the number of cards picked a bit
				const randomPickRatio = 0.6 + 0.4 * Math.random()

				// Maximum number of cards the bot can afford * 0.6-1.0 (random)
				const cardsToPickCount = Math.max(
					0,
					Math.floor(
						(maxMoneySpentOnCards / this.game.state.cardPrice) *
							randomPickRatio,
					),
				)

				const cardsWithScore = a.cards
					.map((c, i) => {
						const card = CardsLookupApi.get(c)

						const missingConditions = card.conditions.filter(
							(cond) =>
								!cond.evaluate({
									player: this.state,
									game: this.game.state,
									card: emptyCardState(card.code),
								}),
						)

						// TODO: playCardScore should check if the card is even playable in some way
						try {
							const score =
								playCardScore(this.scoringContext, CardsLookupApi.get(c))
									.score -
								missingConditions.length * 0.5

							return [score, i]
						} catch {
							return [0, i]
						}
					})
					.sort(([a], [b]) => b - a)
					.map(([, i]) => i)

				const pickedCards = cardsWithScore.slice(0, cardsToPickCount)

				setTimeout(
					() =>
						this.performAction(
							pickStarting(corporation, pickedCards, pickedPreludes),
						),
					this.options.instant
						? 0
						: this.options.fast
							? 200
							: 2000 + Math.random() * 1000,
				)

				return
			}

			case PlayerActionType.PickCards: {
				let ore = this.state.ore
				let titan = this.state.titan

				const moneyRequiredToPlayCardsInHand = this.state.cards
					.map((c) => CardsLookupApi.get(c))
					.reduce((acc, card) => {
						let cost = adjustedCardPrice(card, this.state)

						const playable = isCardPlayable(card, {
							card: emptyCardState(card.code),
							game: this.game.state,
							player: this.state,
						})

						if (playable && card.categories.includes(CardCategory.Building)) {
							const useOre = Math.min(
								ore,
								Math.ceil(cost / this.state.orePrice),
							)

							ore -= useOre

							cost -= useOre * this.state.orePrice
						}

						if (playable && card.categories.includes(CardCategory.Space)) {
							const useTitan = Math.min(
								titan,
								Math.ceil(cost / this.state.titanPrice),
							)

							titan -= useTitan

							cost -= useTitan * this.state.titanPrice
						}

						// Unplayable cards should still be somehow considered, but not much
						if (!playable) {
							cost *= 0.1
						}

						return cost + acc
					}, 0)

				const moneyReservedForCards =
					this.state.money -
					moneyRequiredToPlayCardsInHand * (0.9 + 0.1 * Math.random())

				const cardsWithScore = a.cards
					.map((c, i) => {
						const card = CardsLookupApi.get(c)

						const missingConditions = card.conditions.filter(
							(cond) =>
								!cond.evaluate({
									player: this.state,
									game: this.game.state,
									card: emptyCardState(card.code),
								}),
						)

						// TODO: playCardScore should check if the card is even playable in some way
						try {
							const score =
								playCardScore(this.scoringContext, CardsLookupApi.get(c))
									.score -
								missingConditions.length * 0.5

							return [score, i]
						} catch {
							return [0, i]
						}
					})
					.sort(([a], [b]) => b - a)
					.map(([, i]) => i)

				const picked = a.free
					? cardsWithScore.slice(0, a.limit || a.cards.length)
					: cardsWithScore.slice(
							0,
							Math.max(
								0,
								Math.floor(
									(moneyReservedForCards / this.game.state.cardPrice) *
										(0.6 + 0.4 * Math.random()),
								),
							),
						)

				return this.performAction(pickCards(picked))
			}

			case PlayerActionType.DraftCard: {
				// TODO: Add some kind of logic here
				const picked = shuffle(a.cards.map((_c, i) => i)).slice(0, a.limit)

				return this.performAction(draftCard(picked))
			}

			case PlayerActionType.PickPreludes: {
				// TODO: Add some kind of logic here

				const picked = shuffle(
					a.cards.map((c, i) => [CardsLookupApi.get(c), i] as const),
				)
					.filter(([c]) =>
						isCardPlayable(c, {
							card: emptyCardState(c.code),
							game: this.game.state,
							player: this.state,
						}),
					)
					.map(([, i]) => i)
					.slice(0, a.limit)

				return this.performAction(pickPreludes(picked))
			}

			case PlayerActionType.PlaceTile: {
				const placed = a.state

				const tile = pickBest(
					allCells(this.game.state).filter((c) =>
						canPlace(this.game.state, this.state, c, placed),
					),
					(c) => placeTileScore(this.scoringContext, placed, c),
				)

				if (tile) {
					return this.performAction(placeTile(tile.x, tile.y, tile.location))
				} else {
					return this.performAction(playerPass(true))
				}
			}

			case PlayerActionType.ClaimTile: {
				const tile = pickBest(
					allCells(this.game.state).filter((c) => isClaimable(c)),
					(c) => claimTileScore(this.scoringContext, c),
				)

				if (tile) {
					return this.performAction(claimTile(tile.x, tile.y, tile.location))
				} else {
					return this.performAction(playerPass(true))
				}
			}

			case PlayerActionType.PlayCard: {
				const card = this.state.usedCards[a.cardIndex]

				const args = getBestArgs(
					this.scoring,
					this.game.state,
					this.state,
					card,
					CardsLookupApi.get(card.code).actionEffects,
				)

				return this.performAction(playCard(card.code, a.cardIndex, args.args))
			}

			case PlayerActionType.SponsorCompetition: {
				const comp = shuffle(
					this.game.state.map.competitions
						.map((c) => Competitions[c])
						.filter(
							(c) =>
								!this.game.state.competitions.find((b) => b.type === c.type),
						),
				)[0]

				if (comp) {
					return this.performAction(sponsorCompetition(comp.type))
				} else {
					return this.performAction(playerPass(true))
				}
			}

			case PlayerActionType.SolarPhaseTerraform: {
				// TODO: Scoring?
				const availableProgressValues = (
					['oceans', 'temperature', 'oxygen'] as const
				).filter(
					(progress) =>
						this.game.state[progress] < this.game.state.map[progress],
				)

				const progress = shuffle(availableProgressValues)[0]

				return this.performAction(solarPhaseTerraform(progress))
			}

			case PlayerActionType.AddCardResource: {
				const cardsWithResources = mapCards(this.state.usedCards).filter(
					(c) => c.info.resource === a.data.cardResource,
				)

				// TODO: Pick by score
				const card = pickRandom(cardsWithResources)

				return this.performAction(addCardResource(card.index))
			}

			case PlayerActionType.BuildColony: {
				const availableColonies = [
					...this.game.state.colonies.entries(),
				].filter(([, colony]) =>
					isOk(
						canBuildColony({
							player: this.state,
							game: this.game.state,
							colony,
							allowDuplicates: a.data.allowMoreColoniesPerColony,
							forFree: true,
						}),
					),
				)

				// TODO: Scoring?
				const colony = pickRandom(availableColonies)

				return this.performAction(buildColony(colony[0]))
			}

			case PlayerActionType.ChangeColonyStep: {
				const availableColonies = [
					...this.game.state.colonies.entries(),
				].filter(([, colony]) =>
					a.data.change > 0
						? colony.step <
							ColoniesLookupApi.get(colony.code).tradeIncome.slots.length - 1
						: colony.step > 0,
				)

				// TODO: Scoring
				const colony = pickRandom(availableColonies)

				return this.performAction(changeColonyStep(colony[0]))
			}

			case PlayerActionType.DiscardCards: {
				// TODO: Scoring!
				const cards = shuffle(this.state.usedCards.map((_c, i) => i)).slice(
					0,
					a.data.count,
				)

				return this.performAction(discardCards(cards))
			}

			case PlayerActionType.TradeWithColony: {
				// TODO: Better scoring
				const coloniesForTrade = [...this.game.state.colonies.entries()].sort(
					([, a], [, b]) => b.step - a.step,
				)

				return this.performAction(
					tradeWithColony(coloniesForTrade[0][0], 'money'),
				)
			}
		}

		assertNever(a)
	}

	doSomething() {
		let actions: BotAction[] = []

		const currentScore = computeScore(this.scoring, this.game.state, this.state)

		switch (this.state.state) {
			case PlayerStateValue.Waiting: {
				actions.push(
					action('ready', Infinity, () =>
						this.performAction(playerReady(true)),
					),
				)

				break
			}

			case PlayerStateValue.Picking: {
				const pending = this.pendingAction

				if (pending) {
					actions.push(
						action('performPending', Infinity, () =>
							this.performPending(pending),
						),
					)
				} else {
					this.logger.error('Nothing to do, yet I have to pick something...')
				}

				break
			}

			case PlayerStateValue.EndingTiles: {
				const placed = this.pendingAction

				if (placed && placed.type === PlayerActionType.PlaceTile) {
					const tile = pickBest(
						allCells(this.game.state).filter((c) =>
							canPlace(this.game.state, this.state, c, placed.state),
						),
						(c) => placeTileScore(this.scoringContext, placed.state, c),
					)

					if (tile) {
						actions.push(
							action('placeTile', Infinity, () =>
								this.performAction(placeTile(tile.x, tile.y, tile.location)),
							),
						)
					}
				}

				break
			}

			case PlayerStateValue.Prelude: {
				const pending = this.pendingAction

				if (pending) {
					actions.push(
						action('pickPrelude', Infinity, () => this.performPending(pending)),
					)
				}

				break
			}

			case PlayerStateValue.SolarPhaseTerraform: {
				const pending = this.pendingAction

				if (pending) {
					actions.push(
						action('wgTerraform', Infinity, () => this.performPending(pending)),
					)
				}

				break
			}

			case PlayerStateValue.Playing: {
				const pending = this.pendingAction

				if (pending) {
					actions.push(
						action('pending', Infinity, () => this.performPending(pending)),
					)
				} else {
					if (
						this.game.state.milestones.length < this.game.state.milestonesLimit
					) {
						this.game.state.map.milestones
							.map((m) => Milestones[m])
							.filter(
								(m) =>
									!this.game.state.milestones.find((s) => s.type === m.type),
							)
							.forEach((m) => {
								if (
									this.state.money >= this.game.state.milestonePrice &&
									m.getValue(this.game.state, this.state) >= m.limit
								) {
									actions.push(
										action(
											'buyMilestone ' + MilestoneType[m.type],
											currentScore + this.scoring.victoryPoints,
											() => this.performAction(buyMilestone(m.type)),
										),
									)
								}
							})
					}

					if (
						this.game.state.competitions.length <
						this.game.state.competitionsLimit
					) {
						this.game.state.map.competitions
							.map((c) => Competitions[c])
							.filter(
								(m) =>
									!this.game.state.competitions.find((s) => s.type === m.type),
							)
							.forEach((c) => {
								if (
									this.state.money >= competitionPrice(this.game.state) &&
									c.getScore(this.game.state, this.state) >
										this.game.state.players
											.filter((p) => p.id !== this.id)
											.reduce((m, p) => {
												const s = c.getScore(this.game.state, p)

												return s > m ? s : m
											}, 0) &&
									this.game.state.generation > 5
								) {
									// TODO: Proper score, currently not possible to be executed
									actions.push(
										action(
											'sponsorCompetition ' + CompetitionType[c.type],
											0,
											() => this.performAction(sponsorCompetition(c.type)),
										),
									)
								}
							})
					}

					this.game.state.standardProjects
						.map((p) => Projects[p.type])
						.forEach((p) => {
							if (
								p.conditions.every((c) =>
									c({ game: this.game.state, player: this.state }),
								)
							) {
								if (p.type !== StandardProjectType.SellPatents) {
									const args = getBestProjectArgs(
										this.game.state,
										this.state,
										p,
										this.scoringContext,
									)

									actions.push(
										action(
											'buyStandardProject ' + StandardProjectType[p.type],
											standardProjectScore(this.scoringContext, p, args),
											() =>
												this.performAction(buyStandardProject(p.type, args)),
										),
									)
								}
							}
						})

					for (const card of this.cards) {
						const playable = isCardPlayable(card, {
							card: emptyCardState(card.code),
							game: this.game.state,
							player: this.state,
						})

						const affordable =
							minimalCardPrice(card, this.state) <= this.state.money

						this.debugLogger?.log(
							` card ${card.code}: playable ${playable}, affordable ${affordable}`,
						)
					}

					this.cards
						.filter(
							(c) =>
								isCardPlayable(c, {
									card: emptyCardState(c.code),
									game: this.game.state,
									player: this.state,
								}) && minimalCardPrice(c, this.state) <= this.state.money,
						)
						.forEach((c) => {
							const score = playCardScore(this.scoringContext, c)

							actions.push(
								action(
									`buyCard ${c.code} with ${JSON.stringify(score.args)}`,
									score.score,
									() => {
										try {
											this.performAction(
												buyCard(
													c.code,
													this.state.cards.indexOf(c.code),
													// TODO: Evaluate which resources to use
													c.categories.includes(CardCategory.Building)
														? this.state.ore
														: 0,
													// TODO: Evaluate which resources to use
													c.categories.includes(CardCategory.Space)
														? this.state.titan
														: 0,
													{},
													score.args,
												),
											)
										} catch (e) {
											this.logger.log(
												`Failed to play ${c.code} with ${score.args}`,
											)

											throw e
										}
									},
								),
							)
						})

					this.state.usedCards
						.filter(
							(c) =>
								CardsLookupApi.get(c.code).actionEffects.length > 0 &&
								isCardActionable(CardsLookupApi.get(c.code), {
									card: c,
									game: this.game.state,
									player: this.state,
								}),
						)
						.forEach((c) => {
							const score = useCardScore(this.scoringContext, c)

							actions.push(
								action(
									`playCard ${c.code} with ${JSON.stringify(score.args)}`,
									score.score,
									() => {
										try {
											this.performAction(playCard(c.code, c.index, score.args))
										} catch (e) {
											this.logger.log(
												`Failed to use ${c.code} with ${score.args}`,
											)

											throw e
										}
									},
								),
							)
						})

					this.game.state.colonies.forEach((colony, colonyIndex) => {
						if (!colony.active) {
							return
						}

						for (const resource of COLONY_TRADE_RESOURCES) {
							const canTrade = canTradeWithColonyUsingResource({
								colony,
								game: this.game.state,
								player: this.state,
								resource,
							})

							if (isOk(canTrade)) {
								const score = tradeWithColonyScore(
									this.scoringContext,
									colonyIndex,
									resource,
								)

								if (score >= 0) {
									actions.push(
										action(
											`tradeWithColony ${colony.code} using ${resource}`,
											score,
											() =>
												this.performAction(
													tradeWithColony(colonyIndex, resource),
												),
										),
									)
								}
							}
						}

						const canBuild = canBuildColony({
							player: this.state,
							game: this.game.state,
							colony,
						})

						if (isOk(canBuild)) {
							const score = buildColonyScore(this.scoringContext, colonyIndex)

							if (score >= 0) {
								actions.push(
									action(`buildColony ${colony.code}`, score, () =>
										this.performAction(buildColony(colonyIndex)),
									),
								)
							}
						}
					})

					for (const party of this.game.state.committee.parties) {
						if (
							this.game.state.committee.lobby.some((m) => m.id === this.id) ||
							this.game.state.committee.reserve.some((m) => m?.id === this.id)
						) {
							const score = addDelegateToPartyScore(
								this.scoringContext,
								party.code,
							)

							actions.push(
								action(`add delegate to ${party.code} from lobby`, score, () =>
									this.performAction(
										addDelegateToPartyActionRequest(party.code),
									),
								),
							)
						}
					}

					if (this.game.state.committee.rulingParty) {
						const rulingParty = getCommitteeParty(
							this.game.state.committee.rulingParty,
						)

						for (const index of rulingParty.policy.active.keys()) {
							actions.push(
								action(
									`activate ruling party policy`,
									activatePartyPolicyScore(this.scoringContext, index),
									() =>
										this.performAction(
											activateRulingPolicyActionRequest(index),
										),
								),
							)
						}
					}
				}

				break
			}
		}

		actions.sort(({ score: a }, { score: b }) => b - a)

		// TODO: Threshold should be configurable? Percentage?
		const actionDiscardScoreThreshold = currentScore - 5

		this.debug?.log(f('{0} actions available:', actions.length))

		for (const action of actions) {
			if (action.score < actionDiscardScoreThreshold) {
				this.debug?.log(
					`  ${action.score.toFixed(2)} ${action.description} (discarded)`,
				)
			} else {
				this.debug?.log(`  ${action.score.toFixed(2)} ${action.description}`)
			}
		}

		actions = actions.filter(
			({ score }) => score >= actionDiscardScoreThreshold,
		)

		if (actions.length === 0) {
			if (
				[PlayerStateValue.Playing, PlayerStateValue.EndingTiles].includes(
					this.state.state,
				)
			) {
				this.performAction(playerPass(false))
			}
		} else {
			// In case there's multiple actions with the same top score, pick one randomly
			const bestActions = actions.filter((s) => s.score === actions[0].score)
			pickRandom(bestActions).perform()
		}
	}
}
