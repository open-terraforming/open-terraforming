import { shuffle } from '@/utils/collections'
import { CardCategory, CardsLookupApi } from '@shared/cards'
import {
	emptyCardState,
	isCardActionable,
	isCardPlayable,
	minimalCardPrice
} from '@shared/cards/utils'
import { Competitions } from '@shared/competitions'
import {
	GameStateValue,
	PlayerStateValue,
	StandardProjectType
} from '@shared/game'
import {
	buyCard,
	buyMilestone,
	buyStandardProject,
	claimTile,
	draftCard,
	pickCards,
	pickCorporation,
	pickPreludes,
	placeTile,
	playCard,
	playerPass,
	playerReady,
	sponsorCompetition
} from '@shared/index'
import { Milestones } from '@shared/milestones'
import { canPlace, isClaimable } from '@shared/placements'
import { PlayerAction, PlayerActionType } from '@shared/player-actions'
import { Projects } from '@shared/projects'
import { allCells, competitionPrice, f } from '@shared/utils'
import { Game } from './game'
import { Player } from './player'
import { claimTileScore } from './scoring/claim-tile-score'
import { placeTileScore } from './scoring/place-tile-score'
import { playCardScore } from './scoring/play-card-score'
import { standardProjectScore } from './scoring/standard-project-score'
import { ScoringContext } from './scoring/types'
import { useCardScore } from './scoring/use-card-score'
import { computeScore, getBestArgs, pickBest } from './scoring/utils'

const defaultOptions = () => ({
	fast: false
})

export type BotOptions = ReturnType<typeof defaultOptions>

export class Bot extends Player {
	doing?: ReturnType<typeof setTimeout>

	options: BotOptions

	constructor(game: Game, options: Partial<BotOptions> = {}) {
		super(game)

		this.options = {
			...defaultOptions(),
			...options
		}

		this.state.name = game.pickBotName(this.state.id)
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
				this.options.fast ? 100 : 3000 + Math.random() * 2000
			)
		}

		if (broadcast) {
			super.updated()
		}
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
				return this.performAction(pickCorporation(shuffle(a.cards.slice(0))[0]))
			}

			case PlayerActionType.PickCards: {
				// TODO: Add some kind of logic here
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
										this.game.state.cardPrice) *
										(0.6 + 0.4 * Math.random())
								)
							)
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
					a.cards.map((c, i) => [CardsLookupApi.get(c), i] as const)
				)
					.filter(([c]) =>
						isCardPlayable(c, {
							card: emptyCardState(c.code),
							game: this.game.state,
							player: this.state
						})
					)
					.map(([, i]) => i)
					.slice(0, a.limit)

				return this.performAction(pickPreludes(picked))
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
					return this.performAction(placeTile(tile.x, tile.y))
				} else {
					return this.performAction(playerPass(true))
				}
			}

			case PlayerActionType.ClaimTile: {
				const tile = pickBest(
					allCells(this.game.state).filter(c => isClaimable(c)),
					c => claimTileScore(this.scoringContext, c)
				)

				if (tile) {
					return this.performAction(claimTile(tile.x, tile.y))
				} else {
					return this.performAction(playerPass(true))
				}
			}

			case PlayerActionType.PlayCard: {
				const card = this.state.usedCards[a.cardIndex]

				const args = getBestArgs(
					this.game.state,
					this.state,
					card,
					CardsLookupApi.get(card.code).actionEffects
				)

				return this.performAction(playCard(card.code, a.cardIndex, args.args))
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
					return this.performAction(sponsorCompetition(comp.type))
				} else {
					return this.performAction(playerPass(true))
				}
			}
		}
	}

	doSomething() {
		let actions = [] as [number, () => void][]

		switch (this.state.state) {
			case PlayerStateValue.Waiting: {
				actions.push([0, () => this.performAction(playerReady(true))])
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
						actions.push([
							0,
							() => this.performAction(placeTile(tile.x, tile.y))
						])
					}
				}

				break
			}

			case PlayerStateValue.Playing: {
				const pending = this.pendingAction

				if (pending) {
					actions.push([0, () => this.performPending(pending)])
				} else {
					if (
						this.game.state.milestones.length < this.game.state.milestonesLimit
					) {
						this.game.state.map.milestones
							.map(m => Milestones[m])
							.filter(
								m => !this.game.state.milestones.find(s => s.type === m.type)
							)
							.forEach(m => {
								if (
									this.state.money >= this.game.state.milestonePrice &&
									m.getValue(this.game.state, this.state) >= m.limit
								) {
									actions.push([
										computeScore(this.game.state, this.state) + 5,
										() => {
											this.performAction(buyMilestone(m.type))
										}
									])
								}
							})
					}

					if (
						this.game.state.competitions.length <
						this.game.state.competitionsLimit
					) {
						this.game.state.map.competitions
							.map(c => Competitions[c])
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
											this.performAction(sponsorCompetition(c.type))
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
										this.performAction(buyStandardProject(p.type, []))
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
									game: this.game.state,
									player: this.state
								}) && minimalCardPrice(c, this.state) <= this.state.money
						)
						.forEach(c => {
							const score = playCardScore(this.scoringContext, c)

							this.logger.log(
								c.code,
								'score',
								score.score,
								'with',
								JSON.stringify(score.args)
							)

							actions.push([
								score.score,
								() => {
									try {
										this.performAction(
											buyCard(
												c.code,
												this.state.cards.indexOf(c.code),
												c.categories.includes(CardCategory.Building)
													? this.state.ore
													: 0,
												c.categories.includes(CardCategory.Space)
													? this.state.titan
													: 0,
												score.args
											)
										)
									} catch (e) {
										this.logger.log(
											`Failed to play ${c.code} with ${score.args}`
										)

										throw e
									}
								}
							])
						})

					this.state.usedCards
						.filter(
							c =>
								CardsLookupApi.get(c.code).actionEffects.length > 0 &&
								isCardActionable(CardsLookupApi.get(c.code), {
									card: c,
									game: this.game.state,
									player: this.state
								})
						)
						.forEach(c => {
							const score = useCardScore(this.scoringContext, c)

							actions.push([
								score.score,
								() => {
									try {
										this.performAction(playCard(c.code, c.index, score.args))
									} catch (e) {
										this.logger.log(
											`Failed to use ${c.code} with ${score.args}`
										)

										throw e
									}
								}
							])
						})
				}

				break
			}
		}

		actions = actions.filter(([s]) => s >= 0)

		this.logger.log(f('{0} actions available', actions.length))

		if (actions.length === 0) {
			if (
				[PlayerStateValue.Playing, PlayerStateValue.EndingTiles].includes(
					this.state.state
				)
			) {
				this.performAction(playerPass(false))
			}
		} else {
			const sorted = actions.sort(([a], [b]) => b - a)

			shuffle(sorted.filter(s => s[0] === sorted[0][0]))[0][1]()
		}
	}
}
