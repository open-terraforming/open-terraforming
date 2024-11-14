import { CardsLookupApi, CardType } from '@shared/cards'
import { GameStateValue, playCard, PlayerStateValue } from '@shared/index'
import { PlayerActionType } from '@shared/player-actions'
import { f } from '@shared/utils'
import { PlayerBaseActionHandler } from '../action'
import { processCardsToDiscard } from '@shared/utils/processCardsToDiscard'

type Args = ReturnType<typeof playCard>['data']

export class PlayCardAction extends PlayerBaseActionHandler<Args> {
	states = [PlayerStateValue.Playing]
	gameStates = [GameStateValue.GenerationInProgress]

	perform({ card: cardCode, index, args }: Args) {
		const top = this.pendingAction

		if (
			top !== undefined &&
			(top.type !== PlayerActionType.PlayCard || top.cardIndex !== index)
		) {
			throw new Error("You've got pending actions to attend to")
		}

		const cardState = this.player.usedCards[index]

		if (cardState === undefined || cardState?.code !== cardCode) {
			throw new Error(
				f(
					'Something is wrong, incorrect card index and card type combination {0}/{1}',
					cardCode,
					index,
				),
			)
		}

		if (cardState.played) {
			throw new Error(`${cardCode} was already played this generation`)
		}

		const card = CardsLookupApi.get(cardCode)

		if (!card) {
			throw new Error(`Unknown card ${cardCode}`)
		}

		if (
			top === undefined &&
			card.type !== CardType.Action &&
			card.type !== CardType.Corporation
		) {
			throw new Error(`${card.code} isn't playable`)
		}

		if (card.actionEffects.length === 0) {
			throw new Error(`${card.code} has no action effects`)
		}

		const ctx = {
			player: this.player,
			game: this.game,
			card: cardState,
		}

		this.checkCardConditions(card, ctx, args, true)

		this.logger.log(`Played ${card.code} with`, JSON.stringify(args))

		this.runCardEffects(card.actionEffects, ctx, args)

		processCardsToDiscard(this.game, this.player)

		this.parent.game.checkMilestones()

		if (top) {
			this.popAction()
		} else {
			// TODO: WHY?
			//if (card.type !== CardType.Corporation) {
			cardState.played = true
			//}

			if (!this.pendingAction) {
				this.actionPlayed()
			}
		}
	}
}
