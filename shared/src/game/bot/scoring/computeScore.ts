import { CardsLookupApi } from '@shared/cards'
import {
	resources,
	resourceProduction,
	isCardPlayable,
	emptyCardState,
} from '@shared/cards/utils'
import { getPlayerColoniesCount } from '@shared/expansions/colonies/utils/getPlayerColoniesCount'
import { getPlayerUsedFleets } from '@shared/expansions/colonies/utils/getPlayerUsedFleets'
import { GameState, PlayerState, GridCellContent } from '@shared/index'
import { allCells } from '@shared/utils/allCells'
import { adjTilesList } from '@shared/utils/adjTilesList'
import { tiles } from '@shared/utils/tiles'
import { AiScoringCoefficients } from './defaultScoringCoefficients'
import { resScore } from './resScore'
import { resProductionScore } from './resProductionScore'
import { computePendingActionScore } from './computePendingActionScore'
import { sum } from '@shared/utils/collections'

export const computeScore = (
	s: AiScoringCoefficients,
	g: GameState,
	p: PlayerState,
) => {
	let score = 0

	score += p.terraformRating * s.terraformingRating
	score += p.titanPrice * s.titanPrice
	score += p.orePrice * s.orePrice

	score -= sum(p.cardPriceChanges, (item) => item.change) * s.cardPriceChange

	score -=
		sum(p.tagPriceChanges, (item) => item.change) * s.cardPriceChangePerTag

	// TODO: Should have higher score when milestone for card count is available
	score += p.cards.length * s.cardCount

	// TODO: This is pretty weak, but it's hard to evaluate the "score" price of unplayed card
	score +=
		p.cards.filter((code) =>
			isCardPlayable(CardsLookupApi.get(code), {
				card: emptyCardState(code),
				game: g,
				player: p,
			}),
		).length * s.playableCardsCountScore

	score += resources.reduce(
		(acc, r) =>
			acc +
			p[r] * resScore(s, g, r) +
			p[resourceProduction[r]] * resProductionScore(s, g, r),
		0,
	)

	// TODO: Somehow take actions into account?
	// TODO: Somehow take tag count into account?
	score += p.usedCards
		.map((c) => ({ state: c, info: CardsLookupApi.get(c.code) }))
		.reduce((acc, { info, state }) => {
			const victoryPoints =
				(info.victoryPoints +
					(info.victoryPointsCallback
						? // TODO: This is not good score when deciding if card is worth playing - the VPs usually come later.
							// Currently we compensate this by adding some resources (6) when computing the score of card to be bought
							info.victoryPointsCallback.compute({
								player: p,
								game: g,
								card: state,
							})
						: 0)) *
				s.usedCards.victoryPoints

			const tags = info.categories.reduce(
				(acc, c) => (s.usedCards.tags[c] ?? 0) + acc,
				0,
			)

			const uniqueTags = new Set(info.categories).size * s.usedCards.uniqueTags

			const action = info.actionEffects.length > 0 ? s.usedCards.action : 0

			const passiveEffect =
				info.passiveEffects.length > 0 ? s.usedCards.passiveEffect : 0

			const canBeUsedAsMoney = info.resourcesUsableAsMoney
				? (1 / info.resourcesUsableAsMoney.amount) *
					(info.resourcesUsableAsMoney.categories?.length ?? 5) *
					s.usedCards.resourceAsMoney
				: 0

			return (
				acc +
				victoryPoints +
				tags +
				uniqueTags +
				action +
				passiveEffect +
				canBeUsedAsMoney
			)
		}, 0)

	score +=
		tiles(allCells(g))
			.ownedBy(p.id)
			.asArray()
			.reduce((acc, t) => {
				if (t.content === GridCellContent.City) {
					return acc + adjTilesList(g, t.x, t.y).hasGreenery().length
				}

				if (t.content === GridCellContent.Forest) {
					return acc + 1
				}

				return acc
			}, 0) * s.tileVictoryPoints

	score += p.pendingActions.reduce(
		(acc, a) => acc + computePendingActionScore(s, g, p, a),
		0,
	)

	score +=
		(p.tradeFleets - getPlayerUsedFleets(g, p).length) * s.freeFleetsCount

	score += getPlayerColoniesCount({ game: g, player: p }) * s.coloniesCount

	return score
}
