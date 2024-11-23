import { Resource, SymbolType } from '@shared/cards'
import { PLAYER_RESOURCE_TO_PRODUCTION } from '@shared/constants'
import { Colony, GridCellContent } from '@shared/gameState'
import { discardCardsAction } from '@shared/player-actions'
import { drawCard, drawCards, pushPendingAction, range } from '@shared/utils'
import { colonyDrawCardsBonus } from './bonuses/colonyDrawCardsBonus'
import { colonyResourceBonus } from './bonuses/colonyResourceBonus'
import { colonyTileBonus } from './bonuses/colonyTileBonus'
import { cardResourceColony } from './templates/cardResourceColony'
import { resourceColony } from './templates/resourceColony'
import { colony } from './templates/colony'

const PLUTO_INCOMES = [0, 1, 2, 2, 3, 3, 4]

const EUROPA_INCOMES: Resource[] = [
	'money',
	'money',
	'energy',
	'energy',
	'plants',
	'plants',
	'plants',
]

export const coloniesColonies: Colony[] = [
	resourceColony({
		code: 'triton',
		resource: 'titan',
		incomeBonus: 1,
		colonizeBonus: 3,
		colonizeBonusType: 'resource',
		incomes: [0, 1, 1, 2, 3, 4, 5],
	}),
	colony({
		code: 'europa',
		incomeBonus: colonyResourceBonus('money', 1),
		colonizeBonus: range(0, 3).map(() =>
			colonyTileBonus(GridCellContent.Ocean),
		),
		tradeIncome: {
			symbols: [{ text: 'X' }],
			slots: EUROPA_INCOMES.map((res) => ({
				production: true,
				resource: res,
				count: 1,
			})),
			perform: ({ player, colony }) => {
				const res = EUROPA_INCOMES[colony.step]
				player[PLAYER_RESOURCE_TO_PRODUCTION[res]]++
			},
		},
	}),
	resourceColony({
		code: 'callisto',
		resource: 'energy',
		incomeBonus: 3,
		incomes: [0, 2, 3, 5, 7, 10, 13],
	}),
	resourceColony({
		code: 'ceres',
		resource: 'ore',
		incomeBonus: 2,
		incomes: [1, 2, 3, 4, 6, 8, 10],
	}),
	cardResourceColony({
		code: 'enceladus',
		cardResource: 'microbes',
		colonizeBonus: 3,
		incomeBonus: 1,
		tradeIncome: [0, 1, 2, 3, 4, 4, 5],
	}),
	cardResourceColony({
		code: 'titan',
		cardResource: 'floaters',
		colonizeBonus: 3,
		incomeBonus: 1,
		tradeIncome: [0, 1, 1, 2, 3, 3, 4],
	}),
	colony({
		...cardResourceColony({
			code: 'miranda',
			cardResource: 'animals',
			colonizeBonus: 3,
			incomeBonus: 1,
			tradeIncome: [0, 1, 1, 2, 2, 3, 3],
		}),
		incomeBonus: colonyDrawCardsBonus(1),
	}),
	resourceColony({
		code: 'ganymede',
		resource: 'plants',
		incomeBonus: 1,
		incomes: [0, 1, 2, 3, 4, 5, 6],
	}),
	resourceColony({
		code: 'luna',
		resource: 'money',
		incomeBonus: 2,
		colonizeBonus: 2,
		incomes: [1, 2, 4, 7, 10, 13, 17],
	}),
	resourceColony({
		code: 'io',
		resource: 'heat',
		incomeBonus: 2,
		incomes: [2, 3, 4, 6, 8, 10, 13],
	}),
	colony({
		code: 'pluto',
		incomeBonus: {
			symbols: [
				{ symbol: SymbolType.Plus },
				{ symbol: SymbolType.Card },
				{ symbol: SymbolType.Minus },
				{ symbol: SymbolType.Card },
			],
			perform: ({ game, player }) => {
				// Draw 1 card
				player.cards.push(drawCard(game))
				// Discard 1 card
				pushPendingAction(player, discardCardsAction(1))
			},
		},
		colonizeBonus: range(0, 3).map(() => colonyDrawCardsBonus(2)),
		tradeIncome: {
			symbols: [{ symbol: SymbolType.X }, { symbol: SymbolType.Card }],
			slots: PLUTO_INCOMES.map((i) => ({ text: i.toString() })),
			perform: ({ game, player, colony }) => {
				const count = PLUTO_INCOMES[colony.step]

				if (count <= 0) {
					return
				}

				player.cards.push(...drawCards(game, PLUTO_INCOMES[colony.step]))
			},
		},
	}),
]
