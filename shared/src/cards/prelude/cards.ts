import { GridCellContent, GridCellSpecial } from '../../game'
import { cardCountCondition, gameProgressConditionMax } from '../conditions'
import { getTopCards, placeTile, productionChange } from '../effects'
import { Card, CardCategory, CardSpecial, CardType } from '../types'
import { card } from '../utils'
import { LavaCells } from '../../map'

export const preludeCards: Card[] = [
	card({
		code: 'house_printing',
		title: 'HOUSE PRINTING',
		type: CardType.Building,
		description: '',
		cost: 10,
		categories: [CardCategory.Building],
		special: [CardSpecial.Prelude],
		victoryPoints: 1,
		playEffects: [productionChange('ore', 1)]
	}),
	card({
		code: 'lava_tube_settlement',
		title: 'LAVA TUBE SETTLEMENT',
		type: CardType.Building,
		description: '',
		cost: 15,
		categories: [CardCategory.Building, CardCategory.City],
		special: [CardSpecial.Prelude],
		playEffects: [
			productionChange('energy', -1),
			productionChange('money', 2),
			placeTile({
				type: GridCellContent.City,
				special: LavaCells
			})
		]
	}),
	card({
		code: 'martian_survey',
		title: 'MARTIAN SURVEY',
		type: CardType.Event,
		description: '',
		cost: 9,
		categories: [CardCategory.Event, CardCategory.Science],
		special: [CardSpecial.Prelude],
		victoryPoints: 1,
		conditions: [gameProgressConditionMax('oxygen', 4)],
		playEffects: [getTopCards(2)]
	}),
	/*
	TODO:
	card({
		code: 'psychrophiles',
		title: 'PSYCHROPHILES',
		type: CardType.Action,
		description: '',
		cost: 2,
		categories: [CardCategory.Microbe],
		special: [CardSpecial.Prelude],
		conditions: [gameProgressConditionMax('temperature', -20/2)],
		playEffects: []
	}),
	*/
	card({
		code: 'research_coordination',
		title: 'RESEARCH COORDINATION',
		type: CardType.Building,
		description: 'This cards counts as any tag',
		cost: 4,
		categories: [CardCategory.Any],
		special: [CardSpecial.Prelude]
	}),
	card({
		code: 'sf_memorial',
		title: 'SF MEMORIAL',
		type: CardType.Building,
		description: '',
		cost: 7,
		categories: [CardCategory.Building],
		special: [CardSpecial.Prelude],
		victoryPoints: 1,
		playEffects: [getTopCards(1)]
	}),
	card({
		code: 'space_hotels',
		title: 'SPACE HOTELS',
		type: CardType.Building,
		description: '',
		cost: 12,
		categories: [CardCategory.Space, CardCategory.Earth],
		special: [CardSpecial.Prelude],
		conditions: [cardCountCondition(CardCategory.Earth, 2)],
		playEffects: [productionChange('money', 4)]
	})
]
