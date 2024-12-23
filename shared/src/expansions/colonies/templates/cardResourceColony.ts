import { CardResource, SymbolType, CardsLookupApi } from '@shared/cards'
import { addCardResourceAction } from '@shared/player-actions'
import { pushPendingAction } from '@shared/utils/pushPendingAction'
import { range } from '@shared/utils/range'
import { colonyCardResourceBonus } from '../bonuses/colonyCardResourceBonus'
import { colony } from './colony'
import { mapCards } from '@shared/utils/mapCards'

type Params = {
	code: string
	cardResource: CardResource
	incomeBonus: number
	colonizeBonus: number
	tradeIncome: number[]
	startingStep?: number
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
	startingStep = 1,
}: Params) =>
	colony({
		code,
		incomeBonus: colonyCardResourceBonus(cardResource, incomeBonus),
		colonizeBonus: range(0, 3).map(() =>
			colonyCardResourceBonus(cardResource, colonizeBonus),
		),
		tradeIncome: {
			symbols: [{ symbol: SymbolType.X }, { cardResource }],
			slots: tradeIncome.map((i) => ({
				cardResource,
				count: i,
				forceCount: true,
			})),
			condition: ({ player }) =>
				mapCards(player.usedCards).some(
					(c) => c.info.resource === cardResource,
				),
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
					colony.step = startingStep
					colony.active = true

					return
				}
			}
		},
	})
