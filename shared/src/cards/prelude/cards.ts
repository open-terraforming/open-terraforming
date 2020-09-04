import { GridCellContent } from '../../game'
import { LavaCells } from '../../map'
import { cardCountCondition, gameProgressConditionMax } from '../conditions'
import { getTopCards, placeTile, productionChange } from '../effects'
import { Card, CardCategory, CardSpecial, CardType } from '../types'
import { card } from '../utils'

export const preludeCards: Card[] = [
	card({
		code: 'house_printing',
		type: CardType.Building,
		cost: 10,
		categories: [CardCategory.Building],
		special: [CardSpecial.Prelude],
		victoryPoints: 1,
		playEffects: [productionChange('ore', 1)]
	}),
	card({
		code: 'lava_tube_settlement',
		type: CardType.Building,
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
		type: CardType.Event,
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
		type: CardType.Action,
		cost: 2,
		categories: [CardCategory.Microbe],
		special: [CardSpecial.Prelude],
		conditions: [gameProgressConditionMax('temperature', -20/2)],
		playEffects: []
	}),
	*/
	card({
		code: 'research_coordination',
		type: CardType.Building,
		description: 'This cards counts as any tag',
		cost: 4,
		categories: [CardCategory.Any],
		special: [CardSpecial.Prelude]
	}),
	card({
		code: 'sf_memorial',
		type: CardType.Building,
		cost: 7,
		categories: [CardCategory.Building],
		special: [CardSpecial.Prelude],
		victoryPoints: 1,
		playEffects: [getTopCards(1)]
	}),
	card({
		code: 'space_hotels',
		type: CardType.Building,
		cost: 12,
		categories: [CardCategory.Space, CardCategory.Earth],
		special: [CardSpecial.Prelude],
		conditions: [cardCountCondition(CardCategory.Earth, 2)],
		playEffects: [productionChange('money', 4)]
	})
]
