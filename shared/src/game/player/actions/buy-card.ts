import { CardCategory, CardsLookupApi } from '@shared/cards'
import {
	adjustedCardPrice,
	emptyCardState,
	updatePlayerResource,
} from '@shared/cards/utils'
import { buyCard, GameStateValue, PlayerStateValue } from '@shared/index'
import { PlayerBaseAction } from '../action'

type Args = ReturnType<typeof buyCard>['data']

export class BuyCardAction extends PlayerBaseAction<Args> {
	states = [PlayerStateValue.Playing]
	gameStates = [GameStateValue.GenerationInProgress]

	perform({ card: cardCode, index, args, useOre, useTitan, useCards }: Args) {
		if (this.pendingAction) {
			throw new Error("You've got pending actions to attend to")
		}

		if (this.player.cards[index] !== cardCode) {
			throw new Error(
				'Something is wrong, incorrect card index and card type combination',
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

		if (useCards) {
			for (const [code, amount] of Object.entries(useCards)) {
				const usedCard = this.player.usedCards.find((c) => c.code === code)

				if (!usedCard) {
					throw new Error(`You don't have card ${code} on table`)
				}

				const data = CardsLookupApi.get(code)
				const { resource, resourcesUsableAsMoney } = data

				if (!resource) {
					throw new Error(`Card ${code} doesn't have resource`)
				}

				if (!resourcesUsableAsMoney) {
					throw new Error(`Card ${code} can't be used for payments`)
				}

				if (
					resourcesUsableAsMoney.categories &&
					!resourcesUsableAsMoney.categories.some((cat) =>
						card.categories.includes(cat),
					)
				) {
					throw new Error(`Card ${code} can't be used for payment of this card`)
				}

				if (amount > usedCard[resource]) {
					throw new Error(`You don't have ${amount} of card ${code}`)
				}

				cost -= amount * resourcesUsableAsMoney.amount
				usedCard[resource] -= amount
			}
		}

		if (this.player.money < cost) {
			throw new Error(
				`You don't have money for that, adjusted price was ${cost}.`,
			)
		}

		const cardState = emptyCardState(cardCode, this.player.usedCards.length)

		const ctx = {
			player: this.player,
			game: this.game,
			card: cardState,
		}

		this.checkCardConditions(card, ctx, args)

		this.logger.log(`Bought ${card.code} with`, JSON.stringify(args))

		updatePlayerResource(this.player, 'money', -Math.max(0, cost))
		updatePlayerResource(this.player, 'titan', -useTitan)
		updatePlayerResource(this.player, 'ore', -useOre)

		this.runCardEffects(card.playEffects, ctx, args)
		this.runCardPassiveEffectsOnBuy(card.passiveEffects, ctx)

		this.player.usedCards.push(cardState)
		this.player.cards.splice(index, 1)

		this.parent.onCardPlayed.emit({
			card,
			cardIndex: ctx.card.index,
			player: this.parent,
			moneyCost: Math.max(0, cost),
		})

		this.parent.game.checkMilestones()

		if (!this.pendingAction) {
			this.actionPlayed()
		}
	}
}
