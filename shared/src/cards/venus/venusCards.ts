import { GridCellContent, GridCellSpecial } from '../../game'
import {
	cardCountCondition,
	cardResourcesAnywhereCondition,
	gameProgressConditionMax,
	gameProgressConditionMin,
	terraformRatingMin
} from '../conditions'
import {
	cardResourceAnyAmountChange,
	cardResourceChange,
	discardCard,
	effectChoice,
	gameProcessChange,
	getTopCards,
	hasCardTagsVoidEffect,
	joinedEffects,
	otherCardAnyResourceChange,
	otherCardResourceChange,
	otherCardResourceChangePerTag,
	otherPlayersGetTopCards,
	placeCity,
	placeTile,
	playerResourceChange,
	playerResourceChangeWithTagCondition,
	productionChange,
	productionChangeForTags,
	resourceChange,
	resourceChangeByArg,
	resourcesForTiles,
	tagPriceChange,
	terraformRatingChange
} from '../effects'
import { cardResourcePerCardPlayed } from '../passive-effects'
import { resourceAsPaymentForTags } from '../effects/resourceAsPaymentForTags'
import { Card, CardCategory, CardSpecial, CardType } from '../types'
import { card, withRightArrow } from '../utils'
import { vpsForCardResources } from '../vps'

export const venusCards: Card[] = [
	card({
		code: 'aerial_mappers',
		type: CardType.Action,
		cost: 11,
		categories: [CardCategory.Venus],
		special: [CardSpecial.Venus],
		resource: 'floaters',
		victoryPoints: 1,
		actionEffects: [
			effectChoice([
				withRightArrow(otherCardResourceChange('floaters', 1)),
				joinedEffects([cardResourceChange('floaters', -1), getTopCards(1)])
			])
		]
	}),
	card({
		code: 'aerosport_tournament',
		type: CardType.Event,
		cost: 7,
		categories: [CardCategory.Event],
		special: [CardSpecial.Venus],
		resource: 'floaters',
		conditions: [cardResourcesAnywhereCondition('floaters', 5)],
		// TODO: Every city in play (including cities outside mars?)
		playEffects: [resourcesForTiles(GridCellContent.City, 'money', 1)]
	}),
	card({
		code: 'air_scrapping_expedition',
		type: CardType.Event,
		cost: 13,
		categories: [CardCategory.Venus, CardCategory.Event],
		special: [CardSpecial.Venus],
		playEffects: [
			gameProcessChange('venus', 1),
			otherCardResourceChange('floaters', 3, CardCategory.Venus)
		]
	}),
	card({
		code: 'atalanta_planitia_lab',
		type: CardType.Building,
		cost: 10,
		categories: [CardCategory.Venus, CardCategory.Science],
		special: [CardSpecial.Venus],
		victoryPoints: 2,
		conditions: [cardCountCondition(CardCategory.Science, 3)],
		playEffects: [getTopCards(2)]
	}),
	card({
		code: 'atmoscoop',
		type: CardType.Action,
		cost: 22,
		categories: [CardCategory.Venus, CardCategory.Science],
		special: [CardSpecial.Venus],
		conditions: [cardCountCondition(CardCategory.Science, 3)],
		playEffects: [getTopCards(2)]
	}),
	card({
		code: 'comet_for_venus',
		type: CardType.Event,
		cost: 11,
		categories: [CardCategory.Venus, CardCategory.Event],
		special: [CardSpecial.Venus],
		playEffects: [
			gameProcessChange('venus', 1),
			playerResourceChangeWithTagCondition('money', -4, CardCategory.Venus, 1)
		]
	}),
	card({
		code: 'corroder_suits',
		type: CardType.Building,
		cost: 8,
		categories: [CardCategory.Venus],
		special: [CardSpecial.Venus],
		playEffects: [
			productionChange('money', 2),
			// TODO: Is this just cards in your hand? Or is it card in anybody hand? It should be only in your hand
			otherCardAnyResourceChange(1, CardCategory.Venus)
		]
	}),
	card({
		code: 'dawn_city',
		type: CardType.Building,
		cost: 15,
		categories: [CardCategory.Space, CardCategory.City],
		special: [CardSpecial.Venus],
		conditions: [cardCountCondition(CardCategory.Science, 4)],
		playEffects: [
			productionChange('energy', -1),
			productionChange('titan', 1),
			placeTile({
				type: GridCellContent.City,
				special: [GridCellSpecial.DawnCity]
			})
		]
	}),
	card({
		code: 'deuterium_export',
		type: CardType.Action,
		cost: 11,
		categories: [CardCategory.Venus, CardCategory.Power, CardCategory.Space],
		special: [CardSpecial.Venus],
		resource: 'floaters',
		actionEffects: [
			effectChoice([
				cardResourceChange('floaters', 1),
				joinedEffects([
					withRightArrow(cardResourceChange('floaters', -1)),
					productionChange('energy', 1)
				])
			])
		]
	}),
	card({
		code: 'dirigibles',
		type: CardType.Action,
		cost: 11,
		categories: [CardCategory.Venus],
		special: [CardSpecial.Venus],
		resource: 'floaters',
		actionEffects: [otherCardResourceChange('floaters', 1, CardCategory.Venus)],
		playEffects: [
			resourceAsPaymentForTags('floaters', 3, [CardCategory.Venus])
		],
		resourcesUsableAsMoney: {
			amount: 3,
			categories: [CardCategory.Venus]
		}
	}),
	card({
		code: 'extractor_balloons',
		type: CardType.Action,
		cost: 21,
		categories: [CardCategory.Venus],
		special: [CardSpecial.Venus],
		resource: 'floaters',
		actionEffects: [
			effectChoice([
				cardResourceChange('floaters', 1),
				joinedEffects([
					withRightArrow(cardResourceChange('floaters', -2)),
					gameProcessChange('venus', 1)
				])
			])
		]
	}),
	card({
		code: 'extremophiles',
		type: CardType.Action,
		cost: 3,
		categories: [CardCategory.Venus, CardCategory.Microbe],
		special: [CardSpecial.Venus],
		resource: 'microbes',
		victoryPointsCallback: vpsForCardResources('microbes', 3),
		conditions: [cardCountCondition(CardCategory.Science, 2)],
		actionEffects: [otherCardResourceChange('microbes', 1)]
	}),
	card({
		code: 'floating_habs',
		type: CardType.Action,
		cost: 5,
		categories: [CardCategory.Venus],
		special: [CardSpecial.Venus],
		resource: 'floaters',
		victoryPointsCallback: vpsForCardResources('floaters', 2),
		conditions: [cardCountCondition(CardCategory.Science, 2)],
		actionEffects: [
			withRightArrow(playerResourceChange('money', -2)),
			otherCardResourceChange('floaters', 1)
		]
	}),
	card({
		code: 'forced_precipitation',
		type: CardType.Action,
		cost: 8,
		categories: [CardCategory.Venus],
		special: [CardSpecial.Venus],
		resource: 'floaters',
		playEffects: [
			effectChoice([
				joinedEffects([
					withRightArrow(playerResourceChange('money', -2)),
					cardResourceChange('floaters', 1)
				]),
				joinedEffects([
					withRightArrow(cardResourceChange('floaters', -2)),
					gameProcessChange('venus', 1)
				])
			])
		]
	}),
	card({
		code: 'freyja_biodomes',
		type: CardType.Building,
		cost: 14,
		categories: [CardCategory.Venus],
		special: [CardSpecial.Venus],
		conditions: [gameProgressConditionMin('venus', 10)],
		playEffects: [
			effectChoice([
				otherCardResourceChange('microbes', 2, CardCategory.Venus),
				otherCardResourceChange('animals', 2, CardCategory.Venus)
			]),
			productionChange('energy', -1),
			productionChange('money', 2)
		]
	}),
	card({
		code: 'ghg_import_from_venus',
		type: CardType.Effect,
		cost: 23,
		categories: [CardCategory.Venus, CardCategory.Space, CardCategory.Event],
		special: [CardSpecial.Venus],
		actionEffects: [gameProcessChange('venus', 1), productionChange('heat', 3)]
	}),
	card({
		code: 'giant_solar_shade',
		type: CardType.Building,
		cost: 27,
		categories: [CardCategory.Venus, CardCategory.Space],
		special: [CardSpecial.Venus],
		actionEffects: [gameProcessChange('venus', 3)]
	}),
	card({
		code: 'gyropolis',
		type: CardType.Building,
		cost: 20,
		categories: [CardCategory.City, CardCategory.Building],
		special: [CardSpecial.Venus],
		playEffects: [
			productionChange('energy', -2),
			productionChangeForTags('money', 1, CardCategory.Venus),
			productionChangeForTags('money', 1, CardCategory.Earth),
			placeCity()
		]
	}),
	card({
		code: 'hydrogen_to_venus',
		type: CardType.Event,
		cost: 11,
		categories: [CardCategory.Space, CardCategory.Event],
		special: [CardSpecial.Venus],
		playEffects: [
			gameProcessChange('venus', 1),
			otherCardResourceChangePerTag(
				'floaters',
				1,
				CardCategory.Jupiter,
				CardCategory.Venus
			)
		]
	}),
	card({
		code: 'io_sulphur_research',
		type: CardType.Building,
		cost: 17,
		categories: [CardCategory.Science, CardCategory.Jupiter],
		special: [CardSpecial.Venus],
		victoryPoints: 2,
		playEffects: [
			// TODO: Automatic effect choice?
			effectChoice([
				joinedEffects([
					hasCardTagsVoidEffect(CardCategory.Venus, 3),
					getTopCards(3)
				]),
				getTopCards(1)
			])
		]
	}),
	card({
		code: 'ishtar_mining',
		type: CardType.Building,
		cost: 5,
		categories: [CardCategory.Venus],
		special: [CardSpecial.Venus],
		conditions: [gameProgressConditionMin('venus', 4)],
		playEffects: [productionChange('titan', 1)]
	}),
	card({
		code: 'jet_stream_microscrappers',
		type: CardType.Action,
		cost: 12,
		categories: [CardCategory.Venus],
		special: [CardSpecial.Venus],
		resource: 'floaters',
		actionEffects: [
			effectChoice([
				joinedEffects([
					withRightArrow(playerResourceChange('titan', -1)),
					cardResourceChange('floaters', 2)
				]),
				joinedEffects([
					withRightArrow(otherCardResourceChange('floaters', 2)),
					gameProcessChange('venus', 1)
				])
			])
		]
	}),
	card({
		code: 'local_shading',
		type: CardType.Action,
		cost: 4,
		categories: [CardCategory.Venus],
		special: [CardSpecial.Venus],
		resource: 'floaters',
		actionEffects: [
			effectChoice([
				cardResourceChange('floaters', 1),
				joinedEffects([
					withRightArrow(cardResourceChange('floaters', -1)),
					productionChange('money', 1)
				])
			])
		]
	}),
	card({
		code: 'luna_metropolis',
		type: CardType.Building,
		cost: 21,
		categories: [CardCategory.Space, CardCategory.Earth, CardCategory.City],
		special: [CardSpecial.Venus],
		victoryPoints: 2,
		playEffects: [
			productionChangeForTags('money', 1, CardCategory.Earth),
			placeTile({
				type: GridCellContent.City,
				special: [GridCellSpecial.LunaMetropolis]
			})
		]
	}),
	card({
		code: 'luxury_foods',
		type: CardType.Building,
		cost: 8,
		categories: [],
		special: [CardSpecial.Venus],
		conditions: [
			cardCountCondition(CardCategory.Venus, 1),
			cardCountCondition(CardCategory.Earth, 1),
			cardCountCondition(CardCategory.Jupiter, 1)
		],
		victoryPoints: 2
	}),
	card({
		code: 'maxwell_base',
		type: CardType.Action,
		cost: 18,
		categories: [CardCategory.Venus, CardCategory.City],
		special: [CardSpecial.Venus],
		conditions: [gameProgressConditionMin('venus', 6)],
		actionEffects: [
			// TODO: Is this just cards in your hand? Or is it card in anybody hand? It should be only in your hand
			otherCardAnyResourceChange(1, CardCategory.Venus)
		],
		playEffects: [
			productionChange('energy', -1),
			placeTile({
				type: GridCellContent.City,
				special: [GridCellSpecial.MaxwellBase]
			})
		]
	}),
	card({
		code: 'mining_quota',
		type: CardType.Building,
		cost: 5,
		categories: [CardCategory.Building],
		special: [CardSpecial.Venus],
		conditions: [
			cardCountCondition(CardCategory.Venus, 1),
			cardCountCondition(CardCategory.Earth, 1),
			cardCountCondition(CardCategory.Jupiter, 1)
		],
		playEffects: [productionChange('ore', 2)]
	}),
	card({
		code: 'neutralizer_factory',
		type: CardType.Building,
		cost: 7,
		categories: [CardCategory.Venus],
		special: [CardSpecial.Venus],
		conditions: [gameProgressConditionMin('venus', 5)],
		playEffects: [gameProcessChange('venus', 1)]
	}),
	card({
		code: 'omnicourt',
		type: CardType.Building,
		cost: 11,
		categories: [CardCategory.Building],
		conditions: [
			cardCountCondition(CardCategory.Venus, 1),
			cardCountCondition(CardCategory.Earth, 1),
			cardCountCondition(CardCategory.Jupiter, 1)
		],
		playEffects: [terraformRatingChange(2)]
	}),
	card({
		code: 'orbital_reflectors',
		type: CardType.Building,
		cost: 26,
		categories: [CardCategory.Venus, CardCategory.Space],
		special: [CardSpecial.Venus],
		playEffects: [gameProcessChange('venus', 2), productionChange('heat', 2)]
	}),
	card({
		code: 'rotator_impacts',
		type: CardType.Action,
		cost: 6,
		categories: [CardCategory.Space],
		conditions: [gameProgressConditionMax('venus', 14)],
		resource: 'asteroids',
		actionEffects: [
			effectChoice([
				// TODO: Use titan as payment instead of just choice (allowing to combine both)
				// TODO: The price of titan is not accounted for here
				joinedEffects([
					withRightArrow(resourceChange('money', -6)),
					cardResourceChange('asteroids', 1)
				]),
				joinedEffects([
					withRightArrow(resourceChange('titan', -2)),
					cardResourceChange('asteroids', 1)
				]),
				joinedEffects([
					withRightArrow(cardResourceChange('asteroids', -1)),
					gameProcessChange('venus', 1)
				])
			])
		]
	}),
	card({
		code: 'sister_planet_support',
		type: CardType.Building,
		cost: 7,
		categories: [CardCategory.Venus, CardCategory.Earth],
		special: [CardSpecial.Venus],
		conditions: [
			cardCountCondition(CardCategory.Venus, 1),
			cardCountCondition(CardCategory.Earth, 1)
		],
		playEffects: [productionChange('money', 3)]
	}),
	card({
		code: 'solarnet',
		type: CardType.Building,
		cost: 7,
		categories: [],
		special: [CardSpecial.Venus],
		conditions: [
			cardCountCondition(CardCategory.Venus, 1),
			cardCountCondition(CardCategory.Earth, 1),
			cardCountCondition(CardCategory.Jupiter, 1)
		],
		playEffects: [getTopCards(2)]
	}),
	card({
		code: 'spin_inducing_asteroid',
		type: CardType.Event,
		cost: 16,
		categories: [CardCategory.Space, CardCategory.Event],
		special: [CardSpecial.Venus],
		conditions: [gameProgressConditionMax('venus', 10)],
		playEffects: [gameProcessChange('venus', 2)]
	}),
	card({
		code: 'sponsored_academies',
		type: CardType.Building,
		cost: 9,
		victoryPoints: 1,
		categories: [CardCategory.Science, CardCategory.Earth],
		playEffects: [discardCard(), getTopCards(3), otherPlayersGetTopCards(1)]
	}),
	card({
		code: 'stratopolis',
		type: CardType.Action,
		cost: 22,
		categories: [CardCategory.Venus, CardCategory.City],
		special: [CardSpecial.Venus],
		victoryPointsCallback: vpsForCardResources('floaters', 3),
		conditions: [cardCountCondition(CardCategory.Science, 2)],
		playEffects: [
			productionChange('money', 2),
			placeTile({
				type: GridCellContent.City,
				special: [GridCellSpecial.Stratopolis]
			})
		],
		actionEffects: [otherCardResourceChange('floaters', 2, CardCategory.Venus)]
	}),
	card({
		code: 'stratospheric_birds',
		type: CardType.Action,
		cost: 12,
		categories: [CardCategory.Venus, CardCategory.Animal],
		special: [CardSpecial.Venus],
		resource: 'animals',
		victoryPointsCallback: vpsForCardResources('animals', 1),
		conditions: [gameProgressConditionMin('venus', 6)],
		actionEffects: [cardResourceChange('animals', 1)],
		playEffects: [otherCardResourceChange('floaters', -1)]
	}),
	card({
		code: 'sulphur_exports',
		type: CardType.Building,
		cost: 21,
		categories: [CardCategory.Venus, CardCategory.Space],
		special: [CardSpecial.Venus],
		playEffects: [
			gameProcessChange('venus', 1),
			// TODO: Check if "including this" works
			productionChangeForTags('money', 1, CardCategory.Venus)
		]
	}),
	card({
		code: 'sulphur_eating_bacteria',
		type: CardType.Action,
		cost: 6,
		categories: [CardCategory.Venus, CardCategory.Microbe],
		special: [CardSpecial.Venus],
		resource: 'microbes',
		conditions: [gameProgressConditionMin('venus', 3)],
		actionEffects: [
			effectChoice([
				cardResourceChange('microbes', 1),
				joinedEffects([
					withRightArrow(
						cardResourceAnyAmountChange('microbes', 'into 3X money')
					),
					resourceChangeByArg('money', 3, 0)
				])
			])
		]
	}),
	card({
		code: 'terraforming_contract',
		type: CardType.Building,
		cost: 10,
		categories: [CardCategory.Earth],
		special: [CardSpecial.Venus],
		conditions: [terraformRatingMin(25)],
		playEffects: [productionChange('money', 4)]
	}),
	card({
		code: 'thermophiles',
		type: CardType.Action,
		cost: 9,
		categories: [CardCategory.Venus, CardCategory.Microbe],
		special: [CardSpecial.Venus],
		resource: 'microbes',
		conditions: [gameProgressConditionMin('venus', 3)],
		actionEffects: [
			effectChoice([
				otherCardResourceChange('microbes', 1, CardCategory.Venus),
				joinedEffects([
					withRightArrow(cardResourceChange('microbes', -2)),
					gameProcessChange('venus', 1)
				])
			])
		]
	}),
	card({
		code: 'water_to_venus',
		type: CardType.Event,
		cost: 9,
		categories: [CardCategory.Space, CardCategory.Event],
		special: [CardSpecial.Venus],
		playEffects: [gameProcessChange('venus', 1)]
	}),
	card({
		code: 'venus_governor',
		type: CardType.Building,
		cost: 4,
		categories: [CardCategory.Venus, CardCategory.Venus],
		special: [CardSpecial.Venus],
		conditions: [cardCountCondition(CardCategory.Venus, 2)],
		playEffects: [productionChange('money', 2)]
	}),
	card({
		code: 'venus_magnetizer',
		type: CardType.Action,
		cost: 7,
		categories: [CardCategory.Venus],
		special: [CardSpecial.Venus],
		conditions: [gameProgressConditionMin('venus', 5)],
		// TODO: Double check if the card action is correct (shouldn't it be just energy? not energy production)
		actionEffects: [
			productionChange('energy', -1),
			gameProcessChange('venus', 1)
		]
	}),
	card({
		code: 'venus_soils',
		type: CardType.Building,
		cost: 20,
		categories: [CardCategory.Venus, CardCategory.Plant],
		special: [CardSpecial.Venus],
		actionEffects: [
			gameProcessChange('venus', 1),
			productionChange('plants', 1),
			otherCardResourceChange('microbes', 2)
		]
	}),
	card({
		code: 'venus_waystation',
		type: CardType.Action,
		cost: 9,
		categories: [CardCategory.Venus, CardCategory.Space],
		special: [CardSpecial.Venus],
		playEffects: [tagPriceChange(CardCategory.Venus, -2)]
	}),
	card({
		code: 'venusian_animals',
		type: CardType.Action,
		cost: 15,
		categories: [CardCategory.Venus, CardCategory.Science, CardCategory.Animal],
		special: [CardSpecial.Venus],
		resource: 'animals',
		victoryPointsCallback: vpsForCardResources('animals', 1),
		conditions: [gameProgressConditionMin('venus', 9)],
		playEffects: [cardResourceChange('animals', 1)],
		passiveEffects: [
			// TODO: Does "including this card" apply? Do we really need the play effect?
			cardResourcePerCardPlayed([CardCategory.Science], 'animals', 1)
		]
	}),
	card({
		code: 'venusian_insects',
		type: CardType.Action,
		cost: 5,
		categories: [CardCategory.Venus, CardCategory.Microbe],
		special: [CardSpecial.Venus],
		resource: 'microbes',
		victoryPointsCallback: vpsForCardResources('microbes', 2),
		conditions: [gameProgressConditionMin('venus', 6)],
		actionEffects: [cardResourceChange('microbes', 1)]
	}),
	card({
		code: 'venusian_plants',
		type: CardType.Action,
		cost: 13,
		categories: [CardCategory.Venus, CardCategory.Plant],
		special: [CardSpecial.Venus],
		conditions: [gameProgressConditionMin('venus', 8)],
		playEffects: [
			gameProcessChange('venus', 1),
			effectChoice([
				otherCardResourceChange('microbes', 1, CardCategory.Venus),
				otherCardResourceChange('animals', 1, CardCategory.Venus)
			])
		]
	})
]
