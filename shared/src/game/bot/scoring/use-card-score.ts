import { CardsLookupApi } from '@shared/cards'
import { UsedCardState } from '@shared/index'
import { ScoringContext } from './types'
import { getBestArgs } from './getBestArgs'

export const useCardScore = (
	{ scoring, player, game }: ScoringContext,
	cardState: UsedCardState,
) => {
	const card = CardsLookupApi.get(cardState.code)

	return getBestArgs(scoring, game, player, cardState, card.actionEffects)
}
