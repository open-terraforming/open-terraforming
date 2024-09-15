import { colonyResourceBonus } from '../bonuses/colonyResourceBonus'
import { colonyResourceProductionBonus } from '../bonuses/colonyResourceProduction'
import { Resource, SymbolType } from '@shared/cards'
import { range } from '@shared/utils'
import { colony } from './colony'

type Params = {
	code: string
	resource: Resource
	incomeBonus: number
	colonizeBonus?: number
	colonizeBonusType?: 'production' | 'resource'
	incomes: number[]
}

/**
 * Template for colony that focuses on resources.
 */
export const resourceColony = ({
	code,
	resource,
	incomeBonus,
	colonizeBonus = 1,
	colonizeBonusType = 'production',
	incomes,
}: Params) =>
	colony({
		code,
		incomeBonus: colonyResourceBonus(resource, incomeBonus),
		colonizeBonus: range(0, 3).map(() =>
			colonizeBonusType === 'resource'
				? colonyResourceBonus(resource, colonizeBonus)
				: colonyResourceProductionBonus(resource, colonizeBonus),
		),
		tradeIncome: {
			symbols: [{ symbol: SymbolType.X }, { resource }],
			slots: incomes.map((i) => ({ resource, count: i, forceCount: true })),
			perform: ({ player, colony }) => {
				player[resource] += incomes[colony.step]
			},
		},
	})
