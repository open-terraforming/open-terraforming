import { CardsLookupApi, CardType } from '@shared/cards'
import {
	EventType,
	GameStateValue,
	playCard,
	PlayerStateValue,
} from '@shared/index'
import { PlayerActionType } from '@shared/player-actions'
import { deepCopy } from '@shared/utils/collections'
import { f } from '@shared/utils/f'
import { processCardsToDiscard } from '@shared/utils/processCardsToDiscard'
import { PlayerBaseActionHandler } from '../action'
import { cellByCoords } from '@shared/cards/utils'

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

		const collector = this.startCollectingEvents()

		this.runCardEffects(card.actionEffects, ctx, args)

		processCardsToDiscard(this.game, this.player)

		this.parent.game.checkMilestones()

		collector.collectAndPush((changes) => {
			// TODO: This is terrible! We should have a better way to handle this
			changes.forEach((c) => {
				if (c.type !== EventType.TilePlaced) {
					return
				}

				this.parent.onTilePlaced.emit({
					cell: cellByCoords(this.game, c.cell.x, c.cell.y, c.cell.location),
					player: this.parent,
				})
			})

			return {
				type: EventType.CardUsed,
				playerId: this.player.id,
				card: card.code,
				index: index,
				changes,
				state: deepCopy(cardState),
			} as const
		})

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
