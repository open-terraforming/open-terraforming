import { Card, CardCondition } from '@shared/cards'
import { GameState, PlayerState, UsedCardState } from '..'
import { FilteredCollection } from './FilteredCollection'

export type CollectionCondition<T> = (c: T) => boolean

export type CardInfo = {
	info: Card
	state: UsedCardState
}

export class CardsCollection extends FilteredCollection<CardInfo> {
	fits(game: GameState, player: PlayerState, conditions: CardCondition[]) {
		return this.c(
			(i: CardInfo) =>
				!conditions.find(
					(c) =>
						!c.evaluate({
							game,
							player,
							card: i.state,
						}),
				),
		)
	}
}
