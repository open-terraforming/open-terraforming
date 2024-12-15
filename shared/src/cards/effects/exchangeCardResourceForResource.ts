import { withUnits } from '@shared/units'
import { effectArg } from '../args'
import { cardResourceCondition } from '../conditions'
import { CardResource, Resource, SymbolType } from '../types'
import { CardEffectTarget } from '../args'
import { updatePlayerResource } from '../utils'
import { effect } from './types'

export const exchangeCardResourceForResource = (
	srcRes: CardResource,
	dstRes: Resource,
	dstResCount: number,
) =>
	effect({
		args: [
			effectArg({
				type: CardEffectTarget.CardResourceCount as const,
				descriptionPrefix: 'Exchange',
				descriptionPostfix: `for ${dstResCount} ${dstRes} each`,
			}),
		],
		description: `Exchange ${withUnits(srcRes, 'X')} for ${withUnits(
			dstRes,
			dstResCount,
		)} each`,
		conditions: [cardResourceCondition(srcRes, 1)],
		symbols: [
			{ symbol: SymbolType.X },
			{ cardResource: srcRes },
			{ symbol: SymbolType.RightArrow },
			{ symbol: SymbolType.X },
			{ resource: dstRes, count: dstResCount },
		],
		perform: ({ player, card }, amount: number) => {
			if (card[srcRes] < amount) {
				throw new Error(`You don't have ${amount} of ${srcRes}`)
			}

			card[srcRes] -= amount
			updatePlayerResource(player, dstRes, amount * dstResCount)
		},
	})
