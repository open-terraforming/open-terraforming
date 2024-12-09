import { SymbolType } from '@shared/cards'
import { effect } from '@shared/cards/effects/types'
import { f } from '@shared/utils'

export const extraInfluenceEffect = (influence: number) =>
	effect({
		description: f('Gain {0} extra influence.', influence),
		symbols: [{ symbol: SymbolType.Influence, count: 1, forceSign: true }],
		perform({ player }) {
			player.extraInfluence = (player.extraInfluence ?? 0) + influence
		},
	})
