import { SymbolType } from './cards'
import { Colony } from './game'
import { range } from './utils'

const colony = (c: Colony) => c

const TRITON_INCOMES = [0, 1, 1, 2, 3, 4, 5]

export const colonies: Colony[] = [
	colony({
		code: 'triton',
		incomeBonus: {
			symbols: [{ resource: 'titan', count: 1 }],
			perform: ({ player }) => {
				player.titan++
			},
		},
		colonizeBonus: range(0, 3).map(() => ({
			symbols: [{ resource: 'titan', count: 3 }],
			perform: ({ player }) => {
				player.titan += 3
			},
		})),
		income: {
			symbols: [{ symbol: SymbolType.X }, { resource: 'titan' }],
			slots: TRITON_INCOMES.map((i) => ({ text: i.toString() })),
			perform: ({ player, colony }) => {
				player.titan += TRITON_INCOMES[colony.step]
			},
		},
	}),
]
