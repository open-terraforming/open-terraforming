import { CardsLookupApi } from '@shared/cards'
import { UsedCardState } from '@shared/index'
import { ScoringContext } from './types'
import { getBestArgs } from './utils'

export const useCardScore = (
	{ player, game }: ScoringContext,
	cardState: UsedCardState,
) => {
	const card = CardsLookupApi.get(cardState.code)

	return getBestArgs(game, player, cardState, card.actionEffects)
}
