import { discardCards } from '@shared/actions'
import { GameStateValue, PlayerStateValue } from '@shared/game'
import { PlayerActionType } from '@shared/player-actions'
import { PlayerBaseAction } from '../action'

type Args = ReturnType<typeof discardCards>['data']

export class DiscardCardsAction extends PlayerBaseAction<Args> {
	states = [PlayerStateValue.Playing]
	gameStates = [GameStateValue.GenerationInProgress]

	perform({ cardIndexes }: Args): void {
		if (cardIndexes.length !== new Set(cardIndexes).size) {
			throw new Error('You cant discard one card more than once')
		}

		const top = this.pendingAction

		if (top?.type !== PlayerActionType.DiscardCards) {
			throw new Error('You are not discarding cards right now')
		}

		const { count } = top.data

		if (cardIndexes.length !== count) {
			throw new Error(`You have to discard ${count} cards`)
		}

		const discarded = cardIndexes.map((i) => this.player.cards[i])

		this.player.cards = this.player.cards.filter(
			(_, i) => !cardIndexes.includes(i),
		)

		this.game.discarded.push(...discarded)

		this.popAction()
	}
}
