import { Card, CardCategory, CardSpecial, CardType } from '@shared/cards'
import { productionForTags } from '@shared/cards/effects/production-for-tags'
import {
	getTopCards,
	joinedEffects,
	placeCity,
	placeGreenery,
	playerResourceChange,
	productionChange,
	resourceChange,
	resourceForAllPlayersTags,
	resourcesForPlayersTags,
	terraformRatingChange,
} from '@shared/cards/effectsGrouped'
import { resourcePerCardPlayed } from '@shared/cards/passive-effects'
import { card } from '@shared/cards/utils'
import { chairmanIsNeutralCondition } from './cardConditions/chairmanIsNeutralCondition'
import { playerHasPartyLeadersCondition } from './cardConditions/playerHasPartyLeadersCondition'
import { playerIsChairmanCondition } from './cardConditions/playerIsChairmanCondition'
import { rulingPartyCondition } from './cardConditions/rulingPartyCondition'
import { extraInfluenceEffect } from './cardEffects/extraInfluenceEffect'
import { placeDelegatesEffect } from './cardEffects/placeDelegatesEffect'
import { removeDelegateEffect } from './cardEffects/removeDelegateEffect'
import { replaceNeutralChairmanEffect } from './cardEffects/replaceNeutralChairmanEffect'
import { replaceNeutralMemberEffect } from './cardEffects/replaceNeutralMemberEffect'
import { resourceForEmptyAdjacentTilesEffect } from './cardEffects/resourceForEmptyAdjacentTilesEffect'

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
		special: [CardSpecial.Turmoil],
	}),
	card({
		code: 'banned_delegate',
		type: CardType.Event,
		cost: 0,
		categories: [CardCategory.Event],
		conditions: [playerIsChairmanCondition()],
		playEffects: [removeDelegateEffect()],
		special: [CardSpecial.Turmoil],
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
			placeDelegatesEffect(2),
		],
		special: [CardSpecial.Turmoil],
	}),
	card({
		code: 'diaspora_movement',
		type: CardType.Building,
		cost: 7,
		categories: [CardCategory.Jupiter],
		victoryPoints: 1,
		conditions: [rulingPartyCondition('reds')],
		playEffects: [resourceForAllPlayersTags(CardCategory.Jupiter, 'money', 1)],
		special: [CardSpecial.Turmoil],
	}),
	card({
		code: 'event_analysts',
		type: CardType.Effect,
		cost: 5,
		categories: [CardCategory.Science],
		conditions: [rulingPartyCondition('scientists')],
		playEffects: [extraInfluenceEffect(1)],
		special: [CardSpecial.Turmoil],
	}),
	card({
		code: 'gmo_contract',
		type: CardType.Effect,
		cost: 3,
		categories: [CardCategory.Science, CardCategory.Microbe],
		conditions: [rulingPartyCondition('greens')],
		passiveEffects: [
			resourcePerCardPlayed(
				[CardCategory.Animal, CardCategory.Plant, CardCategory.Microbe],
				'money',
				2,
			),
		],
		special: [CardSpecial.Turmoil],
	}),
	card({
		code: 'martian_media_center',
		type: CardType.Action,
		cost: 7,
		categories: [CardCategory.Building],
		conditions: [rulingPartyCondition('mars_first')],
		playEffects: [productionChange('money', 2)],
		actionEffects: [
			joinedEffects(
				[resourceChange('money', -3), placeDelegatesEffect(1)],
				'to',
			),
		],
		special: [CardSpecial.Turmoil],
	}),
	card({
		code: 'parliament_hall',
		type: CardType.Building,
		cost: 8,
		categories: [CardCategory.Building],
		victoryPoints: 1,
		conditions: [rulingPartyCondition('mars_first')],
		playEffects: [productionForTags(CardCategory.Building, 'money', 1 / 3)],
		special: [CardSpecial.Turmoil],
	}),
	card({
		code: 'pr_office',
		type: CardType.Building,
		cost: 7,
		categories: [CardCategory.Earth],
		conditions: [rulingPartyCondition('unity')],
		playEffects: [
			terraformRatingChange(1),
			resourcesForPlayersTags(CardCategory.Earth, 'money', 1, true),
		],
		special: [CardSpecial.Turmoil],
	}),
	card({
		code: 'public_celebrations',
		type: CardType.Event,
		cost: 8,
		categories: [CardCategory.Event],
		conditions: [playerIsChairmanCondition()],
		victoryPoints: 2,
		special: [CardSpecial.Turmoil],
	}),
	card({
		code: 'recruitment',
		type: CardType.Event,
		cost: 2,
		categories: [CardCategory.Event],
		playEffects: [replaceNeutralMemberEffect()],
		special: [CardSpecial.Turmoil],
	}),
	card({
		code: 'red_tourism_wave',
		type: CardType.Event,
		categories: [CardCategory.Earth, CardCategory.Event],
		cost: 3,
		conditions: [rulingPartyCondition('reds')],
		playEffects: [resourceForEmptyAdjacentTilesEffect('money', 1)],
		special: [CardSpecial.Turmoil],
	}),
	card({
		code: 'sponsored_mohole',
		type: CardType.Building,
		cost: 5,
		categories: [CardCategory.Building],
		conditions: [rulingPartyCondition('kelvinists')],
		playEffects: [productionChange('heat', 2)],
		special: [CardSpecial.Turmoil],
	}),
	card({
		code: 'supported_research',
		type: CardType.Building,
		categories: [CardCategory.Science],
		cost: 3,
		conditions: [rulingPartyCondition('scientists')],
		playEffects: [getTopCards(2)],
		special: [CardSpecial.Turmoil],
	}),
	card({
		code: 'wildlife_dome',
		type: CardType.Building,
		cost: 15,
		categories: [
			CardCategory.Animal,
			CardCategory.Plant,
			CardCategory.Building,
		],
		conditions: [rulingPartyCondition('greens')],
		playEffects: [placeGreenery()],
		special: [CardSpecial.Turmoil],
	}),
	card({
		code: 'vote_of_no_confidence',
		type: CardType.Event,
		cost: 5,
		categories: [CardCategory.Event],
		conditions: [
			playerHasPartyLeadersCondition(1),
			chairmanIsNeutralCondition(),
		],
		playEffects: [replaceNeutralChairmanEffect()],
		special: [CardSpecial.Turmoil],
	}),
	card({
		code: 'political_alliance',
		type: CardType.Event,
		cost: 4,
		categories: [CardCategory.Event],
		conditions: [playerHasPartyLeadersCondition(2)],
		playEffects: [terraformRatingChange(1)],
		special: [CardSpecial.Turmoil],
	}),
]
