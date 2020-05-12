import { CardCategory, CardsLookupApi } from '@shared/cards'
import {
	adjustedCardPrice,
	emptyCardState,
	updatePlayerResource
} from '@shared/cards/utils'
import { buyCard, GameStateValue, PlayerStateValue } from '@shared/index'
import { PlayerBaseAction } from '../action'

type Args = ReturnType<typeof buyCard>['data']

export class BuyCardAction extends PlayerBaseAction<Args> {
	states = [PlayerStateValue.Picking]
	gameStates = [GameStateValue.GenerationInProgress]

	perform({ card: cardCode, index, args, useOre, useTitan }: Args) {
		if (this.pendingAction) {
			throw new Error("You've got pending actions to attend to")
		}

		if (this.player.cards[index] !== cardCode) {
			throw new Error(
				'Something is wrong, incorrect card index and card type combination'
			)
		}

		const card = CardsLookupApi.get(cardCode)

		if (!card) {
			throw new Error(`Unknown card ${cardCode}`)
		}

		let cost = adjustedCardPrice(card, this.player)

		if (useOre > 0) {
			if (!card.categories.includes(CardCategory.Building)) {
				throw new Error('You can only use ore to pay for buildings')
			}

			if (useOre > this.player.ore) {
				throw new Error("You don't have that much ore")
			}

			useOre = Math.min(useOre, Math.ceil(cost / this.player.orePrice))
			cost -= useOre * this.player.orePrice
		}

		if (useTitan > 0) {
			if (!card.categories.includes(CardCategory.Space)) {
				throw new Error('You can only use titan to pay for space cards')
			}

			if (useTitan > this.player.titan) {
				throw new Error("You don't have that much titan")
			}

			useTitan = Math.min(useTitan, Math.ceil(cost / this.player.titanPrice))
			cost -= useTitan * this.player.titanPrice
		}

		if (this.player.money < cost) {
			throw new Error(
				`You don't have money for that, adjusted price was ${cost}.`
			)
		}

		const cardState = emptyCardState(cardCode, this.player.usedCards.length)

		const ctx = {
			player: this.player,
			game: this.game,
			card: cardState
		}

		this.checkCardConditions(card, ctx, args)

		this.logger.log(`Bought ${card.code} with`, JSON.stringify(args))

		updatePlayerResource(this.player, 'money', -Math.max(0, cost))
		updatePlayerResource(this.player, 'titan', -useTitan)
		updatePlayerResource(this.player, 'ore', -useOre)

		this.runCardEffects(card.playEffects, ctx, args)

		this.player.usedCards.push(cardState)
		this.player.cards.splice(index, 1)

		this.parent.onCardPlayed.emit({
			card,
			cardIndex: ctx.card.index,
			player: this.parent
		})

		this.parent.game.checkMilestones()

		if (!this.pendingAction) {
			this.actionPlayed()
		}
	}
}
