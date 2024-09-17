import {
	Resource,
	CardEffectTarget,
	SymbolType,
	CardEffectType,
} from '../types'
import { effectArg } from '../args'
import { withUnits } from '../../units'
import { productionCondition } from '../conditions'
import { resourceProduction, updatePlayerProduction } from '../utils'
import { effect } from './types'

export const exchangeProduction = (srcRes: Resource, dstRes: Resource) =>
	effect({
		args: [
			effectArg({
				type: CardEffectTarget.Production,
				resource: srcRes,
				descriptionPrefix: 'Exchange',
				descriptionPostfix: `production for ${dstRes} production`,
			}),
		],
		description: `Exchange ${withUnits(srcRes, 'X')} production for ${withUnits(
			dstRes,
			'X',
		)} production`,
		conditions: [productionCondition(srcRes, 1)],
		type: CardEffectType.Production,
		symbols: [
			{ symbol: SymbolType.X },
			{ resource: srcRes, production: true },
			{ symbol: SymbolType.RightArrow },
			{ symbol: SymbolType.X },
			{ resource: dstRes, production: true },
		],
		perform: ({ player }, amount: number) => {
			if (player[resourceProduction[srcRes]] < amount) {
				throw new Error(`You don't have ${amount} of ${srcRes}`)
			}

			updatePlayerProduction(player, srcRes, -amount)
			updatePlayerProduction(player, dstRes, amount)
		},
	})
