import { CardsLookupApi } from '@shared/cards'
import { emptyCardState } from '@shared/cards/utils'
import { GameStateValue, pickPreludes, PlayerStateValue } from '@shared/index'
import { PlayerActionType } from '@shared/player-actions'
import { f } from '@shared/utils'
import { PlayerBaseAction } from '../action'

type Args = ReturnType<typeof pickPreludes>['data']

export class PickPreludesAction extends PlayerBaseAction<Args> {
	states = [PlayerStateValue.Picking, PlayerStateValue.Playing]
	gameStates = [GameStateValue.Starting, GameStateValue.GenerationInProgress]

	perform({ cards }: Args) {
		const top = this.pendingAction

		if (top?.type !== PlayerActionType.PickPreludes) {
			throw new Error('You are not picking preludes right now')
		}

		if (new Set(cards).size !== cards.length) {
			throw new Error('You cant pick one card twice')
		}

		if (cards.find(c => c >= top.cards.length || c < 0)) {
			throw new Error('Invalid list of cards to pick')
		}

		if (top.limit > 0) {
			if (cards.length !== top.limit) {
				throw new Error(`You have to pick ${cards.length} cards`)
			}
		}

		// Preludes can actually be unplayable under certain conditions
		cards
			.map(c => CardsLookupApi.get(top.cards[c]))
			.forEach(c =>
				this.checkCardConditions(
					c,
					{
						card: emptyCardState(c.code),
						game: this.game,
						player: this.player
					},
					[]
				)
			)

		this.logger.log(
			f('Picked preludes: {0}', cards.map(c => top.cards[c]).join(', '))
		)

		const usedCards = cards.map((c, i) =>
			emptyCardState(top.cards[c], this.player.usedCards.length + i)
		)

		this.player.usedCards = [...this.player.usedCards, ...usedCards]

		this.game.preludeDiscarded = [
			...this.game.preludeDiscarded,
			...top.cards.filter((_c, i) => !cards.includes(i))
		]

		this.popAction()
	}
}
