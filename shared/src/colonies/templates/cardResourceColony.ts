import { CardResource, CardsLookupApi, SymbolType } from '../../cards'
import { addCardResourceAction } from '../../player-actions'
import { pushPendingAction, range } from '../../utils'
import { colonyCardResourceBonus } from '../bonuses/colonyCardResourceBonus'
import { colony } from '../utils'

type Params = {
	code: string
	cardResource: CardResource
	incomeBonus: number
	colonizeBonus: number
	tradeIncome: number[]
}

/**
 * Template for colony that focuses on card resources.
 */
export const cardResourceColony = ({
	code,
	cardResource,
	incomeBonus,
	colonizeBonus,
	tradeIncome,
}: Params) =>
	colony({
		code,
		incomeBonus: colonyCardResourceBonus(cardResource, incomeBonus),
		colonizeBonus: range(0, 3).map(() =>
			colonyCardResourceBonus(cardResource, colonizeBonus),
		),
		tradeIncome: {
			symbols: [{ symbol: SymbolType.X }, { cardResource }],
			slots: tradeIncome.map((i) => ({ text: i.toString() })),
			perform: ({ player, colony }) => {
				const count = tradeIncome[colony.step]

				if (count <= 0) {
					return
				}

				pushPendingAction(
					player,
					addCardResourceAction(cardResource, tradeIncome[colony.step]),
				)
			},
		},
		activationCallback: ({ game, colony }) => {
			for (const player of game.players) {
				const usedCards = player.usedCards.map((c) =>
					CardsLookupApi.get(c.code),
				)

				if (usedCards.some((c) => c.resource === cardResource)) {
					// TODO: Is this step correct for all cards?
					colony.step = 1
					colony.active = true

					return
				}
			}
		},
	})
