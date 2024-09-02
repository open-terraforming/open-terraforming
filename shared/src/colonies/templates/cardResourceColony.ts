import { CardResource, SymbolType } from '../../cards'
import { colony } from '../utils'
import { colonyCardResourceBonus } from '../bonuses/colonyCardResourceBonus'
import { addCardResourceAction } from '../../player-actions'
import { range, pushPendingAction } from '../../utils'

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
	})
