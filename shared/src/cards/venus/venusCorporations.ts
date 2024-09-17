import {
	getTopCardsWithTag,
	anyCardResourceChange,
	productionChange,
	resourceChange,
} from '../effectsGrouped'
import { changeProgressConditionBonusPerTag } from '../effects/changeProgressConditionBonusPerTag'
import { markCardAsUnplayed } from '../effects/mark-card-as-unplayed'
import {
	resourceForProductionChange,
	resourceForProgress,
} from '../passive-effects'
import { Card, CardCategory, CardSpecial, CardType } from '../types'
import { card } from '../utils'
import { vpsForCardResources } from '../vps'

export const venusCorporations: Card[] = [
	card({
		code: 'aphrodite',
		type: CardType.Corporation,
		categories: [CardCategory.Venus, CardCategory.Plant],
		special: [CardSpecial.Venus],
		cost: 0,
		playEffects: [resourceChange('money', 47), productionChange('plants', 1)],
		passiveEffects: [resourceForProgress('venus', 'money', 2)],
	}),
	card({
		code: 'celestic',
		type: CardType.Corporation,
		categories: [CardCategory.Venus],
		special: [CardSpecial.Venus],
		cost: 0,
		resource: 'floaters',
		playEffects: [
			resourceChange('money', 42),
			getTopCardsWithTag(2, CardCategory.Venus),
		],
		actionEffects: [anyCardResourceChange('floaters', 1)],
		victoryPointsCallback: vpsForCardResources('floaters', 1 / 3),
	}),
	card({
		code: 'manutech',
		type: CardType.Corporation,
		categories: [CardCategory.Building],
		special: [CardSpecial.Venus],
		cost: 0,
		playEffects: [
			productionChange('ore', 1),
			resourceChange('money', 35),
			resourceChange('ore', 1),
		],
		passiveEffects: [resourceForProductionChange()],
	}),
	card({
		code: 'mining_star_inc',
		type: CardType.Corporation,
		categories: [CardCategory.Venus],
		special: [CardSpecial.Venus],
		cost: 0,
		playEffects: [
			resourceChange('money', 50),
			getTopCardsWithTag(3, CardCategory.Venus),
			// TODO: Test this
			changeProgressConditionBonusPerTag(CardCategory.Venus, 2),
		],
	}),
	card({
		code: 'viron',
		type: CardType.Corporation,
		categories: [CardCategory.Microbe],
		special: [CardSpecial.Venus],
		cost: 0,
		playEffects: [resourceChange('money', 48)],
		// TODO: Test this
		actionEffects: [markCardAsUnplayed],
	}),
]
