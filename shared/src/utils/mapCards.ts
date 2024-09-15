import { CardsLookupApi } from '@shared/cards'
import { UsedCardState } from '@shared/game'

export const mapCards = (input: UsedCardState[]) =>
	input.map((c, i) => ({ card: c, info: CardsLookupApi.get(c.code), index: i }))
