import { Card, CardCategory, CardType } from '@shared/cards'
import {
	placeCity,
	playerResourceChange,
	productionChange,
	resourceForTagsPlayed,
} from '@shared/cards/effectsGrouped'
import { card } from '@shared/cards/utils'
import { playerIsChairmanCondition } from './cardConditions/playerIsChairmanCondition'
import { rulingPartyCondition } from './cardConditions/rulingPartyCondition'

export const turmoilCards: Card[] = [
	card({
		code: 'aerial_lenses',
		type: CardType.Building,
		cost: 2,
		categories: [],
		victoryPoints: -1,
		conditions: [rulingPartyCondition('kelvinists')],
		playEffects: [
			playerResourceChange('plants', -2, true),
			productionChange('heat', 2),
		],
	}),
	card({
		code: 'banned_delegate',
		type: CardType.Event,
		cost: 0,
		categories: [CardCategory.Event],
		conditions: [playerIsChairmanCondition()],
		playEffects: [
			// TODO: Remove any NON-LEADER delegate
			// TODO: removeDelegateAction()
		],
	}),
	card({
		code: 'cultural_metropolis',
		type: CardType.Building,
		cost: 20,
		categories: [CardCategory.City, CardCategory.Building],
		conditions: [rulingPartyCondition('unity')],
		playEffects: [
			productionChange('energy', -1),
			productionChange('money', 3),
			placeCity(),
			// TODO: Place 2 delegates to same party
			// TODO: placeDelegates(2)
		],
	}),
	card({
		code: 'diaspora_movement',
		type: CardType.Building,
		cost: 7,
		categories: [CardCategory.Jupiter],
		victoryPoints: 1,
		conditions: [rulingPartyCondition('reds')],
		playEffects: [resourceForTagsPlayed(CardCategory.Jupiter, 'money', 1)],
	}),
	card({
		code: 'event_analysts',
		type: CardType.Action,
		cost: 5,
		categories: [CardCategory.Science],
		conditions: [rulingPartyCondition('scientists')],
		passiveEffects: [
			// TODO: You have +1 influence
		],
	}),
]
