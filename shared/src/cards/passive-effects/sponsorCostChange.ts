import { withUnits } from '@shared/units'
import { f } from '@shared/utils'
import { passiveEffect } from '../passive-effects'
import { SymbolType } from '../types'

export const sponsorCostChange = (sponsorCost: number) =>
	passiveEffect({
		description: f(
			'Sponsoring a project costs {0} instead of $3',
			withUnits('money', sponsorCost),
		),
		symbols: [
			{ symbol: SymbolType.Card },
			{ symbol: SymbolType.Colon },
			{ resource: 'money', count: sponsorCost },
		],
		onPlay(ctx) {
			ctx.player.sponsorCost = sponsorCost
		},
	})
