import { withUnits } from '@shared/units'
import { effectArg } from '../args'
import { condition } from '../conditions'
import { CardEffectTarget, SymbolType } from '../types'
import { resToPrice, updatePlayerResource } from '../utils'
import { effect } from './types'

export const moneyOrResPayment = (res: 'ore' | 'titan', cost: number) =>
	effect({
		args: [
			effectArg({
				type: CardEffectTarget.Resource,
				resource: res,
				descriptionPrefix: `Use`,
				descriptionPostfix: `instead of $`,
				maxAmount: (ctx) => Math.ceil(cost / ctx.player[resToPrice[res]]),
			}),
		],
		conditions: [
			condition({
				evaluate: ({ player }) =>
					player.money + player[res] * player[resToPrice[res]] >= cost,
			}),
		],
		description: `Pay ${withUnits('money', cost)} (${res} can also be used)`,
		symbols: [
			{ resource: 'money', count: cost },
			{ symbol: SymbolType.SlashSmall },
			{ resource: res },
		],
		perform: (ctx, value: number) => {
			if (value > ctx.player[res]) {
				throw new Error(`Player don't have that much ${res}`)
			}

			if (ctx.player.money + value * ctx.player[resToPrice[res]] < cost) {
				throw new Error(`Player can't afford that`)
			}

			const usedRes = Math.min(
				Math.ceil(cost / ctx.player[resToPrice[res]]),
				value,
			)

			updatePlayerResource(ctx.player, res, -usedRes)

			updatePlayerResource(
				ctx.player,
				'money',
				-Math.max(0, cost - usedRes * ctx.player[resToPrice[res]]),
			)
		},
	})
