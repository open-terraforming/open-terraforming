import { UsedCardState } from '@shared/index'
import {
	CardCondition,
	CardCallbackContext,
	CardsLookupApi,
} from '@shared/cards'
import { CardInfo } from '@/pages/Game/pages/Table/components/CardDisplay/CardDisplay'
import { emptyCardState } from '@shared/cards/utils'

export const cardsToCardList = (
	cards: UsedCardState[],
	conditions: CardCondition[] = [],
	ctx: Partial<CardCallbackContext> = {},
) =>
	cards
		.map(
			(c, i) =>
				({
					card: CardsLookupApi.get(c.code),
					index: i,
					state: c,
				}) as CardInfo,
		)
		.filter(
			(item) =>
				conditions.length === 0 ||
				conditions.every((c) =>
					c.evaluate({
						...ctx,
						card: item.state || emptyCardState(item.card.code),
					} as CardCallbackContext),
				),
		)
