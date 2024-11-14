import { addCardResource } from '@shared/actions'
import { CardsLookupApi } from '@shared/cards'
import { GameStateValue, PlayerStateValue } from '@shared/gameState'
import { PlayerActionType } from '@shared/player-actions'
import { PlayerBaseActionHandler } from '../action'

type Args = ReturnType<typeof addCardResource>['data']

export class AddCardResourceAction extends PlayerBaseActionHandler<Args> {
	states = [PlayerStateValue.Playing]
	gameStates = [GameStateValue.GenerationInProgress]

	perform({ cardIndex }: Args): void {
		const top = this.pendingAction

		if (top?.type !== PlayerActionType.AddCardResource) {
			throw new Error('You are not adding card resource right now')
		}

		const { cardResource, amount } = top.data

		const card = this.player.usedCards[cardIndex]

		if (!card) {
			throw new Error('Invalid card index')
		}

		const resource = CardsLookupApi.get(card.code).resource

		if (cardResource !== resource) {
			throw new Error(
				`Invalid card resource, card has ${resource}, expected ${cardResource}`,
			)
		}

		card[cardResource] += amount

		this.popAction()
	}
}
