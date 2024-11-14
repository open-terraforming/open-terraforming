import { GameStateValue, pickCards, PlayerStateValue } from '@shared/index'
import { PlayerActionType } from '@shared/player-actions'
import { f } from '@shared/utils'
import { PlayerBaseActionHandler } from '../action'

type Args = ReturnType<typeof pickCards>['data']

export class PickCardsAction extends PlayerBaseActionHandler<Args> {
	states = [PlayerStateValue.Picking, PlayerStateValue.Playing]
	gameStates = [
		GameStateValue.Starting,
		GameStateValue.ResearchPhase,
		GameStateValue.GenerationInProgress,
	]

	perform({ cards }: Args) {
		const top = this.pendingAction

		if (top?.type !== PlayerActionType.PickCards) {
			throw new Error('You are not picking cards right now')
		}

		if (new Set(cards).size !== cards.length) {
			throw new Error('You cant pick one card twice')
		}

		if (cards.find((c) => c >= top.cards.length || c < 0)) {
			throw new Error('Invalid list of cards to pick')
		}

		if (top.limit > 0) {
			if (cards.length !== top.limit) {
				throw new Error(`You have to pick ${cards.length} cards`)
			}
		}

		if (!top.free) {
			const cost =
				cards.length * (this.player.sponsorCost ?? this.game.cardPrice)

			if (cost > this.player.money) {
				throw new Error("You don't have money for that")
			}

			this.player.money -= cost
		}

		this.logger.log(
			f('Picked cards: {0}', cards.map((c) => top.cards[c]).join(', ')),
		)

		this.player.cards = [
			...this.player.cards,
			...cards.map((c) => top.cards[c]),
		]

		this.game.discarded.push(...top.cards.filter((_c, i) => !cards.includes(i)))

		this.popAction()
	}
}
