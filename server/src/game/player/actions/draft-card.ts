import { GameStateValue, pickCards, PlayerStateValue } from '@shared/index'
import { draftCardAction, PlayerActionType } from '@shared/player-actions'
import { f, getPlayerIndex, pushPendingAction } from '@shared/utils'
import { PlayerBaseAction } from '../action'

type Args = ReturnType<typeof pickCards>['data']

export class DraftCardAction extends PlayerBaseAction<Args> {
	states = [PlayerStateValue.Picking]
	gameStates = [GameStateValue.Draft]

	perform({ cards }: Args) {
		const top = this.pendingAction

		if (top?.type !== PlayerActionType.DraftCard) {
			throw new Error('You are not drafting card right now')
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

		this.logger.log(
			f('Drafted cards: {0}', cards.map(c => top.cards[c]).join(', '))
		)

		this.player.draftedCars = [
			...this.player.draftedCars,
			...cards.map(c => top.cards[c])
		]

		// Pass the rest to next player
		const theRest = top.cards.filter((_c, i) => !cards.includes(i))

		if (theRest.length > 0) {
			const playerIndex = getPlayerIndex(this.game, this.player.id)

			if (playerIndex < 0) {
				throw new Error(
					`Failed to locate player #${this.player.id} in game array!`
				)
			}

			const nextPlayer = this.game.players[
				(playerIndex + 1) % this.game.players.length
			]

			if (theRest.length > 1) {
				pushPendingAction(nextPlayer, draftCardAction(theRest, 1))
				nextPlayer.state = PlayerStateValue.Picking
			} else {
				nextPlayer.draftedCars = [...nextPlayer.draftedCars, theRest[0]]
			}
		}

		this.popAction()
	}
}
