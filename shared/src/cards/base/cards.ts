import { GridCellContent, GridCellOther, GridCellSpecial } from '../../game'
import { LavaCells } from '../../map'
import { OtherPlacement, PlacementCode } from '../../placements'
import {
	cardCountCondition,
	gameProgressConditionMax,
	gameProgressConditionMin,
	joinedCardCountCondition,
	ownedCellTypeCondition,
	productionCondition
} from '../conditions'
import {
	addResourceToCard,
	cardExchange,
	cardPriceChange,
	cardResourceChange,
	cardsForResource,
	changeProgressConditionBonus,
	claimCell,
	convertResource,
	convertTopCardToCardResource,
	doNothing,
	duplicateProduction,
	earthCardPriceChange,
	effectChoice,
	exchangeResources,
	gameProcessChange,
	getTopCards,
	joinedEffects,
	moneyOrResForOcean,
	orePriceChange,
	otherCardResourceChange,
	pickTopCards,
	placeOcean,
	placeTile,
	playerCardResourceChange,
	playerProductionChange,
	playerResourceChange,
	productionChange,
	productionChangeForTags,
	productionChangeIfTags,
	productionForPlayersTags,
	productionForTiles,
	protectedHabitat,
	resourceChange,
	resourceForCities,
	resourcesForPlayersTags,
	resourcesForTiles,
	spaceCardPriceChange,
	terraformRatingChange,
	terraformRatingForTags,
	titanPriceChange,
	triggerCardResourceChange
} from '../effects'
import { exchangeProduction } from '../effects/exchange-production'
import { productionForTags } from '../effects/production-for-tags'
import {
	cardExchangeEffect,
	cardResourcePerAnybodyTilePlaced,
	cardResourcePerCardPlayed,
	cardResourcePerTilePlaced,
	changeResourceFromNeighbor,
	emptyPassiveEffect,
	playWhenCard,
	productionChangeAfterPlace,
	productionPerPlacedTile,
	resetCardPriceChange,
	resetProgressBonus,
	resourceForStandardProject,
	resourcePerCardPlayed,
	resourcePerPlacedTile
} from '../passive-effects'
import { Card, CardCategory, CardSpecial, CardType } from '../types'
import { card, noDesc, withRightArrow } from '../utils'
import {
	minCardResourceToVP,
	vpsForAdjacentTiles,
	vpsForCardResources,
	vpsForCards,
	vpsForTiles
} from '../vps'

export const baseCards: Card[] = [
	card({
		code: 'colonizer_training_camp',
		type: CardType.Building,
		cost: 8,
		categories: [CardCategory.Building, CardCategory.Jupiter],
		victoryPoints: 2,
		conditions: [gameProgressConditionMax('oxygen', 5)]
	}),
	card({
		code: 'asteroid_mining_consortium',
		type: CardType.Building,
		cost: 13,
		categories: [CardCategory.Jupiter],
		special: [CardSpecial.CorporationsEra],
		victoryPoints: 1,
		conditions: [productionCondition('titan', 1)],
		playEffects: [
			playerProductionChange('titan', -1),
			productionChange('titan', 1)
		]
	}),
	card({
		code: 'deep_well_heating',
		type: CardType.Building,
		cost: 13,
		categories: [CardCategory.Building, CardCategory.Power],
		playEffects: [
			productionChange('energy', +1),
			gameProcessChange('temperature', 1)
		]
	}),
	card({
		code: 'cloud_seeding',
		type: CardType.Building,
		cost: 11,
		categories: [],
		conditions: [gameProgressConditionMin('oceans', 3)],
		playEffects: [
			productionChange('money', -1),
			playerProductionChange('heat', -1),
			productionChange('plants', +2)
		]
	}),
	card({
		code: 'search_for_life',
		type: CardType.Action,
		cost: 3,
		categories: [CardCategory.Science],
		conditions: [gameProgressConditionMax('oxygen', 6)],
		actionEffects: [
			convertTopCardToCardResource(CardCategory.Microbe, 'science', 1)
		],
		victoryPointsCallback: minCardResourceToVP('science', 1, 3)
	}),
	card({
		code: 'inventors_guild',
		type: CardType.Action,
		cost: 9,
		categories: [CardCategory.Science],
		special: [CardSpecial.CorporationsEra],
		actionEffects: [pickTopCards(1)]
	}),
	card({
		code: 'martian_rails',
		type: CardType.Action,
		cost: 13,
		categories: [CardCategory.Building],
		actionEffects: [resourceForCities('energy', 1, 'money', 1)]
	}),
	card({
		code: 'capital',
		type: CardType.Building,
		cost: 26,
		categories: [CardCategory.Building, CardCategory.City],
		conditions: [gameProgressConditionMin('oceans', 4)],
		playEffects: [
			placeTile({ type: GridCellContent.City }),
			productionChange('energy', -2),
			productionChange('money', 5)
		],
		victoryPointsCallback: vpsForAdjacentTiles(GridCellContent.Ocean, 1)
	}),
	card({
		code: 'asteroid',
		type: CardType.Event,
		cost: 14,
		categories: [CardCategory.Event, CardCategory.Space],
		playEffects: [
			gameProcessChange('temperature', 1),
			resourceChange('titan', 2),
			playerResourceChange('plants', -3)
		]
	}),
	card({
		code: 'comet',
		type: CardType.Event,
		cost: 21,
		categories: [CardCategory.Event, CardCategory.Space],
		playEffects: [
			placeOcean(),
			gameProcessChange('temperature', 1),
			playerResourceChange('plants', -3)
		]
	}),
	card({
		code: 'big_asteroid',
		type: CardType.Event,
		cost: 27,
		categories: [CardCategory.Event, CardCategory.Space],
		playEffects: [
			gameProcessChange('temperature', 2),
			resourceChange('titan', 4),
			playerResourceChange('plants', -4)
		]
	}),
	card({
		code: 'water_import_from_europa',
		type: CardType.Action,
		cost: 25,
		categories: [CardCategory.Space, CardCategory.Jupiter],
		actionEffects: [moneyOrResForOcean('titan', 12)],
		victoryPointsCallback: vpsForCards(CardCategory.Jupiter, 1)
	}),
	card({
		code: 'space_elevator',
		type: CardType.Action,
		cost: 27,
		categories: [CardCategory.Space, CardCategory.Building],
		special: [CardSpecial.CorporationsEra],
		victoryPoints: 2,
		playEffects: [productionChange('titan', 1)],
		actionEffects: [convertResource('ore', 1, 'money', 5)]
	}),
	card({
		code: 'development_center',
		type: CardType.Action,
		cost: 11,
		categories: [CardCategory.Building, CardCategory.Science],
		special: [CardSpecial.CorporationsEra],
		actionEffects: [cardsForResource('energy', 1, 1)]
	}),
	card({
		code: 'equatorial_magnetizer',
		type: CardType.Action,
		cost: 11,
		categories: [CardCategory.Building],
		actionEffects: [
			withRightArrow(productionChange('energy', -1)),
			terraformRatingChange(1)
		]
	}),
	card({
		code: 'domed_crater',
		type: CardType.Building,
		cost: 24,
		categories: [CardCategory.Building, CardCategory.City],
		victoryPoints: 1,
		conditions: [gameProgressConditionMax('oxygen', 7)],
		playEffects: [
			productionChange('energy', -1),
			productionChange('money', 3),
			resourceChange('plants', 3),
			placeTile({ type: GridCellContent.City })
		]
	}),
	card({
		code: 'noctis_city',
		type: CardType.Building,
		cost: 18,
		categories: [CardCategory.Building, CardCategory.City],
		playEffects: [
			productionChange('energy', -1),
			productionChange('money', 3),
			placeTile({
				type: GridCellContent.City,
				special: [GridCellSpecial.NoctisCity],
				conditions: [PlacementCode.NoctisCity]
			})
		]
	}),
	card({
		code: 'methane_from_titan',
		type: CardType.Building,
		cost: 28,
		categories: [CardCategory.Space, CardCategory.Jupiter],
		victoryPoints: 2,
		conditions: [gameProgressConditionMin('oxygen', 2)],
		playEffects: [productionChange('heat', 2), productionChange('plants', 2)]
	}),
	card({
		code: 'imported_hydrogen',
		type: CardType.Event,
		cost: 16,
		categories: [CardCategory.Event, CardCategory.Space, CardCategory.Earth],
		playEffects: [
			effectChoice([
				resourceChange('plants', 3),
				otherCardResourceChange('microbes', 1),
				otherCardResourceChange('animals', 1)
			]),
			placeOcean()
		]
	}),
	card({
		code: 'research_outpost',
		type: CardType.Effect,
		cost: 18,
		categories: [
			CardCategory.Building,
			CardCategory.City,
			CardCategory.Science
		],
		special: [CardSpecial.CorporationsEra],
		playEffects: [
			cardPriceChange(-1),
			placeTile({
				type: GridCellContent.City,
				conditions: [PlacementCode.NoOceans, PlacementCode.Isolated]
			})
		]
	}),
	card({
		code: 'phobos_space_haven',
		type: CardType.Building,
		cost: 25,
		categories: [CardCategory.Space, CardCategory.City],
		victoryPoints: 3,
		playEffects: [
			productionChange('titan', 1),
			placeTile({
				type: GridCellContent.City,
				special: [GridCellSpecial.PhobosSpaceHaven]
			})
		]
	}),
	card({
		code: 'black_polar_dust',
		type: CardType.Building,
		cost: 15,
		categories: [],
		playEffects: [
			productionChange('money', -2),
			productionChange('heat', 3),
			placeOcean()
		]
	}),
	card({
		code: 'arctic_algae',
		type: CardType.Effect,
		cost: 12,
		categories: [CardCategory.Plant],
		conditions: [gameProgressConditionMax('temperature', -12 / 2)],
		passiveEffects: [resourcePerPlacedTile(GridCellContent.Ocean, 'plants', 2)]
	}),
	card({
		code: 'predators',
		type: CardType.Action,
		cost: 14,
		categories: [CardCategory.Animal],
		resource: 'animals',
		conditions: [gameProgressConditionMin('oxygen', 11)],
		actionEffects: [
			withRightArrow(otherCardResourceChange('animals', -1)),
			cardResourceChange('animals', 1)
		],
		victoryPointsCallback: vpsForCardResources('animals', 1)
	}),
	card({
		code: 'space_station',
		type: CardType.Effect,
		cost: 10,
		categories: [CardCategory.Space],
		special: [CardSpecial.CorporationsEra],
		playEffects: [spaceCardPriceChange(-2)],
		victoryPoints: 1
	}),
	card({
		code: 'eos_chasma_national_park',
		type: CardType.Building,
		cost: 16,
		categories: [CardCategory.Building, CardCategory.Plant],
		victoryPoints: 1,
		conditions: [gameProgressConditionMin('temperature', -12 / 2)],
		playEffects: [
			otherCardResourceChange('animals', 1),
			resourceChange('plants', 3),
			productionChange('money', 2)
		]
	}),
	card({
		code: 'interstellar_colony_ship',
		type: CardType.Event,
		cost: 24,
		categories: [CardCategory.Event, CardCategory.Space, CardCategory.Earth],
		special: [CardSpecial.CorporationsEra],
		victoryPoints: 4,
		conditions: [cardCountCondition(CardCategory.Science, 5)]
	}),
	card({
		code: 'security_fleet',
		type: CardType.Action,
		cost: 12,
		categories: [CardCategory.Space],
		special: [CardSpecial.CorporationsEra],
		resource: 'fighters',
		actionEffects: [
			withRightArrow(resourceChange('titan', -1)),
			cardResourceChange('fighters', 1)
		],
		victoryPointsCallback: vpsForCardResources('fighters', 1)
	}),
	card({
		code: 'cupola_city',
		type: CardType.Building,
		cost: 16,
		categories: [CardCategory.Building, CardCategory.City],
		conditions: [gameProgressConditionMax('oxygen', 9)],
		playEffects: [
			productionChange('energy', -1),
			productionChange('money', 3),
			placeTile({ type: GridCellContent.City })
		]
	}),
	card({
		code: 'lunar_beam',
		type: CardType.Building,
		cost: 13,
		categories: [CardCategory.Power, CardCategory.Earth],
		playEffects: [
			productionChange('money', -2),
			productionChange('heat', 2),
			productionChange('energy', 2)
		]
	}),
	card({
		code: 'optimal_aerobraking',
		type: CardType.Effect,
		cost: 7,
		categories: [CardCategory.Space],
		passiveEffects: [
			resourcePerCardPlayed(
				[CardCategory.Space, CardCategory.Event],
				'money',
				3
			),
			resourcePerCardPlayed([CardCategory.Space, CardCategory.Event], 'heat', 3)
		]
	}),
	card({
		code: 'underground_city',
		type: CardType.Building,
		cost: 18,
		categories: [CardCategory.Building, CardCategory.City],
		playEffects: [
			productionChange('energy', -2),
			productionChange('money', 2),
			placeTile({ type: GridCellContent.City })
		]
	}),
	card({
		code: 'regolith_eaters',
		type: CardType.Action,
		cost: 13,
		resource: 'microbes',
		categories: [CardCategory.Microbe, CardCategory.Science],
		actionEffects: [
			effectChoice([
				cardResourceChange('microbes', 1),
				joinedEffects([
					withRightArrow(cardResourceChange('microbes', -2)),
					gameProcessChange('oxygen', 1)
				])
			])
		]
	}),
	card({
		code: 'ghg_producing_bacteria',
		type: CardType.Action,
		cost: 8,
		resource: 'microbes',
		categories: [CardCategory.Microbe, CardCategory.Science],
		conditions: [gameProgressConditionMin('oxygen', 4)],
		actionEffects: [
			effectChoice([
				cardResourceChange('microbes', 1),
				joinedEffects([
					withRightArrow(cardResourceChange('microbes', -2)),
					gameProcessChange('temperature', 1)
				])
			])
		]
	}),
	card({
		code: 'ants',
		type: CardType.Action,
		cost: 9,
		categories: [CardCategory.Microbe],
		resource: 'microbes',
		conditions: [gameProgressConditionMin('oxygen', 4)],
		actionEffects: [
			withRightArrow(playerCardResourceChange('microbes', -1)),
			cardResourceChange('microbes', 1)
		],
		victoryPointsCallback: vpsForCardResources('microbes', 1 / 2)
	}),
	card({
		code: 'release_of_inert_gases',
		type: CardType.Event,
		cost: 14,
		categories: [CardCategory.Event],
		playEffects: [terraformRatingChange(2)]
	}),
	card({
		code: 'nitrogen_rich_asteroid',
		type: CardType.Event,
		cost: 31,
		categories: [CardCategory.Event, CardCategory.Space],
		playEffects: [
			terraformRatingChange(2),
			gameProcessChange('temperature', 1),
			effectChoice([
				productionChangeIfTags('plants', 4, CardCategory.Plant, 3),
				productionChange('plants', 3)
			])
		]
	}),
	card({
		code: 'rover_construction',
		type: CardType.Effect,
		cost: 8,
		categories: [CardCategory.Building],
		victoryPoints: 1,
		passiveEffects: [resourcePerPlacedTile(GridCellContent.City, 'money', 2)]
	}),
	card({
		code: 'deimos_down',
		type: CardType.Event,
		cost: 31,
		categories: [CardCategory.Event, CardCategory.Space],
		playEffects: [
			gameProcessChange('temperature', 3),
			resourceChange('ore', 4),
			playerResourceChange('plants', -8)
		]
	}),
	card({
		code: 'asteroid_mining',
		type: CardType.Building,
		cost: 30,
		categories: [CardCategory.Space, CardCategory.Jupiter],
		victoryPoints: 2,
		playEffects: [productionChange('titan', 2)]
	}),
	card({
		code: 'food_factory',
		type: CardType.Building,
		cost: 12,
		categories: [CardCategory.Building],
		victoryPoints: 1,
		playEffects: [productionChange('plants', -1), productionChange('money', 4)]
	}),
	card({
		code: 'archaebacteria',
		type: CardType.Building,
		cost: 6,
		categories: [CardCategory.Microbe],
		conditions: [gameProgressConditionMax('temperature', -18 / 2)],
		playEffects: [productionChange('plants', 1)]
	}),
	card({
		code: 'carbonate_processing',
		type: CardType.Building,
		cost: 6,
		categories: [CardCategory.Building],
		playEffects: [productionChange('energy', -1), productionChange('heat', 3)]
	}),
	card({
		code: 'natural_preserve',
		type: CardType.Building,
		cost: 9,
		categories: [CardCategory.Building, CardCategory.Science],
		victoryPoints: 1,
		conditions: [gameProgressConditionMax('oxygen', 4)],
		playEffects: [
			productionChange('money', 1),
			placeTile({
				type: GridCellContent.Other,
				other: GridCellOther.NaturalPreserve,
				conditions: [PlacementCode.NoOceans, PlacementCode.Isolated]
			})
		]
	}),
	card({
		code: 'nuclear_power',
		type: CardType.Building,
		cost: 10,
		categories: [CardCategory.Building, CardCategory.Power],
		playEffects: [productionChange('money', -2), productionChange('energy', 3)]
	}),
	card({
		code: 'lightning_harvest',
		type: CardType.Building,
		cost: 8,
		categories: [CardCategory.Power],
		special: [CardSpecial.CorporationsEra],
		victoryPoints: 1,
		conditions: [cardCountCondition(CardCategory.Science, 3)],
		playEffects: [productionChange('energy', 1), productionChange('money', 1)]
	}),
	card({
		code: 'algae',
		type: CardType.Building,
		cost: 10,
		categories: [CardCategory.Plant],
		conditions: [gameProgressConditionMin('oceans', 5)],
		playEffects: [resourceChange('plants', 1), productionChange('plants', 2)]
	}),
	card({
		code: 'adapted_lichen',
		type: CardType.Building,
		cost: 9,
		categories: [CardCategory.Plant],
		playEffects: [productionChange('plants', 1)]
	}),
	card({
		code: 'tardigrades',
		type: CardType.Action,
		cost: 4,
		categories: [CardCategory.Microbe],
		special: [CardSpecial.CorporationsEra],
		resource: 'microbes',
		actionEffects: [cardResourceChange('microbes', 1)],
		victoryPointsCallback: vpsForCardResources('microbes', 1 / 4)
	}),
	card({
		code: 'virus',
		type: CardType.Event,
		cost: 1,
		categories: [CardCategory.Event, CardCategory.Microbe],
		special: [CardSpecial.CorporationsEra],
		playEffects: [
			effectChoice([
				playerResourceChange('plants', -5),
				playerCardResourceChange('animals', -2)
			])
		]
	}),
	card({
		code: 'miranda_resort',
		type: CardType.Building,
		cost: 12,
		categories: [CardCategory.Space, CardCategory.Jupiter],
		special: [CardSpecial.CorporationsEra],
		victoryPoints: 1,
		playEffects: [productionChangeForTags('money', 1, CardCategory.Earth)]
	}),
	card({
		code: 'fish',
		type: CardType.Action,
		cost: 9,
		resource: 'animals',
		categories: [CardCategory.Animal],
		conditions: [gameProgressConditionMin('temperature', 2 / 2)],
		playEffects: [playerProductionChange('plants', -1)],
		actionEffects: [cardResourceChange('animals', 1)],
		victoryPointsCallback: vpsForCardResources('animals', 1)
	}),
	card({
		code: 'lake_marineris',
		type: CardType.Building,
		cost: 18,
		categories: [],
		victoryPoints: 2,
		conditions: [gameProgressConditionMin('temperature', 0 / 2)],
		playEffects: [placeOcean(), placeOcean()]
	}),
	card({
		code: 'small_animals',
		type: CardType.Action,
		cost: 6,
		resource: 'animals',
		categories: [CardCategory.Animal],
		conditions: [gameProgressConditionMin('oxygen', 6)],
		playEffects: [playerProductionChange('plants', -1)],
		actionEffects: [cardResourceChange('animals', 1)],
		victoryPointsCallback: vpsForCardResources('animals', 1 / 2)
	}),
	card({
		code: 'kelp_farming',
		type: CardType.Building,
		cost: 17,
		categories: [CardCategory.Plant],
		victoryPoints: 1,
		conditions: [gameProgressConditionMin('oceans', 6)],
		playEffects: [
			productionChange('money', 2),
			productionChange('plants', 3),
			resourceChange('plants', 2)
		]
	}),
	card({
		code: 'mine',
		type: CardType.Building,
		cost: 4,
		categories: [CardCategory.Building],
		special: [CardSpecial.CorporationsEra],
		playEffects: [productionChange('ore', 1)]
	}),
	card({
		code: 'vesta_shipyard',
		type: CardType.Building,
		cost: 15,
		categories: [CardCategory.Space, CardCategory.Jupiter],
		special: [CardSpecial.CorporationsEra],
		victoryPoints: 1,
		playEffects: [productionChange('titan', 1)]
	}),
	card({
		code: 'beam_from_a_thorium_asteroid',
		type: CardType.Building,
		cost: 32,
		categories: [CardCategory.Power, CardCategory.Space, CardCategory.Jupiter],
		victoryPoints: 1,
		conditions: [cardCountCondition(CardCategory.Jupiter, 1)],
		playEffects: [productionChange('heat', 3), productionChange('energy', 3)]
	}),
	card({
		code: 'mangrove',
		type: CardType.Building,
		cost: 12,
		categories: [CardCategory.Plant],
		victoryPoints: 1,
		conditions: [gameProgressConditionMin('temperature', 4 / 2)],
		playEffects: [
			placeTile({
				type: GridCellContent.Forest,
				conditions: [PlacementCode.OceanOnly]
			})
		]
	}),
	card({
		code: 'trees',
		type: CardType.Building,
		cost: 13,
		categories: [CardCategory.Plant],
		victoryPoints: 1,
		conditions: [gameProgressConditionMin('temperature', -4 / 2)],
		playEffects: [productionChange('plants', 3), resourceChange('plants', 1)]
	}),
	card({
		code: 'great_escarpment_consortium',
		type: CardType.Building,
		cost: 6,
		categories: [],
		special: [CardSpecial.CorporationsEra],
		playEffects: [playerProductionChange('ore', -1), productionChange('ore', 1)]
	}),
	card({
		code: 'mineral_deposit',
		type: CardType.Event,
		cost: 5,
		categories: [CardCategory.Event],
		special: [CardSpecial.CorporationsEra],
		playEffects: [resourceChange('ore', 5)]
	}),
	card({
		code: 'mining_expedition',
		type: CardType.Event,
		cost: 12,
		categories: [CardCategory.Event],
		playEffects: [
			gameProcessChange('oxygen', 1),
			resourceChange('ore', 2),
			playerResourceChange('plants', -2, false)
		]
	}),
	card({
		code: 'mining_area',
		type: CardType.Building,
		cost: 4,
		categories: [CardCategory.Building],
		special: [CardSpecial.CorporationsEra],
		playEffects: [
			placeTile({
				type: GridCellContent.Other,
				other: GridCellOther.Mine,
				conditions: [
					...OtherPlacement,
					PlacementCode.TitanOreBonus,
					PlacementCode.NextToOwn
				]
			})
		],
		passiveEffects: [productionChangeAfterPlace(1, GridCellOther.Mine)]
	}),
	card({
		code: 'building_industries',
		type: CardType.Building,
		cost: 6,
		categories: [CardCategory.Building],
		special: [CardSpecial.CorporationsEra],
		playEffects: [productionChange('energy', -1), productionChange('ore', 2)]
	}),
	card({
		code: 'land_claim',
		type: CardType.Event,
		cost: 1,
		categories: [CardCategory.Event],
		special: [CardSpecial.CorporationsEra],
		playEffects: [claimCell()]
	}),
	card({
		code: 'mining_rights',
		type: CardType.Building,
		cost: 9,
		categories: [CardCategory.Building],
		playEffects: [
			placeTile({
				type: GridCellContent.Other,
				other: GridCellOther.Mine,
				conditions: [PlacementCode.NoOceans, PlacementCode.TitanOreBonus]
			})
		],
		passiveEffects: [productionChangeAfterPlace(1, GridCellOther.Mine)]
	}),
	card({
		code: 'sponsors',
		type: CardType.Building,
		cost: 6,
		categories: [CardCategory.Earth],
		special: [CardSpecial.CorporationsEra],
		playEffects: [productionChange('money', 2)]
	}),
	card({
		code: 'electro_catapult',
		type: CardType.Action,
		cost: 17,
		categories: [CardCategory.Building],
		special: [CardSpecial.CorporationsEra],
		victoryPoints: 1,
		conditions: [gameProgressConditionMax('oxygen', 8)],
		playEffects: [productionChange('energy', -1)],
		actionEffects: [
			effectChoice([
				convertResource('plants', 1, 'money', 7),
				convertResource('ore', 1, 'money', 7)
			])
		]
	}),
	card({
		code: 'earth_catapult',
		type: CardType.Effect,
		cost: 23,
		categories: [CardCategory.Earth],
		special: [CardSpecial.CorporationsEra],
		victoryPoints: 2,
		playEffects: [cardPriceChange(-2)]
	}),
	card({
		code: 'advanced_alloys',
		type: CardType.Effect,
		cost: 9,
		categories: [CardCategory.Science],
		special: [CardSpecial.CorporationsEra],
		playEffects: [orePriceChange(1), titanPriceChange(1)]
	}),
	card({
		code: 'birds',
		type: CardType.Action,
		cost: 10,
		resource: 'animals',
		categories: [CardCategory.Animal],
		conditions: [gameProgressConditionMin('oxygen', 13)],
		playEffects: [playerProductionChange('plants', -2)],
		actionEffects: [cardResourceChange('animals', 1)],
		victoryPointsCallback: vpsForCardResources('animals', 1)
	}),
	card({
		code: 'mars_university',
		type: CardType.Effect,
		cost: 8,
		categories: [CardCategory.Building, CardCategory.Science],
		special: [CardSpecial.CorporationsEra],
		victoryPoints: 1,
		actionEffects: [effectChoice([doNothing(), cardExchange()])],
		passiveEffects: [cardExchangeEffect(CardCategory.Science)]
	}),
	card({
		code: 'viral_enhancers',
		type: CardType.Effect,
		cost: 9,
		categories: [CardCategory.Microbe, CardCategory.Science],
		special: [CardSpecial.CorporationsEra],
		actionEffects: [
			effectChoice([resourceChange('plants', 1), triggerCardResourceChange(1)])
		],
		passiveEffects: [
			playWhenCard([
				CardCategory.Plant,
				CardCategory.Microbe,
				CardCategory.Animal
			])
		]
	}),
	card({
		code: 'towing_a_comet',
		type: CardType.Event,
		cost: 23,
		categories: [CardCategory.Event, CardCategory.Space],
		playEffects: [
			resourceChange('plants', 2),
			gameProcessChange('oxygen', 1),
			placeOcean()
		]
	}),
	card({
		code: 'space_mirrors',
		type: CardType.Action,
		cost: 3,
		categories: [CardCategory.Space, CardCategory.Power],
		actionEffects: [
			withRightArrow(resourceChange('money', -7)),
			productionChange('energy', 1)
		]
	}),
	card({
		code: 'solar_wind_power',
		type: CardType.Building,
		cost: 11,
		categories: [CardCategory.Power, CardCategory.Space, CardCategory.Science],
		playEffects: [productionChange('energy', 1), resourceChange('titan', 2)]
	}),
	card({
		code: 'ice_asteroid',
		type: CardType.Event,
		cost: 23,
		categories: [CardCategory.Event, CardCategory.Space],
		playEffects: [placeOcean(), placeOcean()]
	}),
	card({
		code: 'quantum_extractor',
		type: CardType.Effect,
		cost: 13,
		categories: [CardCategory.Power, CardCategory.Science],
		special: [CardSpecial.CorporationsEra],
		conditions: [cardCountCondition(CardCategory.Science, 4)],
		playEffects: [productionChange('energy', 4), spaceCardPriceChange(-2)]
	}),
	card({
		code: 'giant_ice_asteroid',
		type: CardType.Event,
		cost: 36,
		categories: [CardCategory.Event, CardCategory.Space],
		playEffects: [
			gameProcessChange('temperature', 2),
			placeOcean(),
			placeOcean(),
			playerResourceChange('plants', -6)
		]
	}),
	card({
		code: 'ganymede_colony',
		type: CardType.Building,
		cost: 20,
		categories: [CardCategory.City, CardCategory.Space, CardCategory.Jupiter],
		playEffects: [
			placeTile({
				type: GridCellContent.City,
				special: [GridCellSpecial.GanymedeColony]
			})
		],
		victoryPointsCallback: vpsForCards(CardCategory.Jupiter, 1)
	}),
	card({
		code: 'callisto_penal_mines',
		type: CardType.Building,
		cost: 24,
		categories: [CardCategory.Space, CardCategory.Jupiter],
		special: [CardSpecial.CorporationsEra],
		playEffects: [productionChange('money', 3)],
		victoryPoints: 2
	}),
	card({
		code: 'giant_space_mirror',
		type: CardType.Building,
		cost: 17,
		categories: [CardCategory.Space, CardCategory.Power],
		playEffects: [productionChange('energy', 3)]
	}),
	card({
		code: 'trans_neptune_probe',
		type: CardType.Building,
		cost: 6,
		categories: [CardCategory.Space, CardCategory.Science],
		special: [CardSpecial.CorporationsEra],
		victoryPoints: 1
	}),
	card({
		code: 'commercial_district',
		type: CardType.Building,
		cost: 16,
		categories: [CardCategory.Building],
		special: [CardSpecial.CorporationsEra],
		playEffects: [
			productionChange('energy', -1),
			productionChange('money', 4),
			placeTile({
				type: GridCellContent.Other,
				other: GridCellOther.CommercialDistrict
			})
		],
		victoryPointsCallback: vpsForAdjacentTiles(GridCellContent.City, 1)
	}),
	card({
		code: 'robotic_workforce',
		type: CardType.Building,
		cost: 9,
		categories: [CardCategory.Science],
		special: [CardSpecial.CorporationsEra],
		playEffects: [duplicateProduction(CardCategory.Building)]
	}),
	card({
		code: 'grass',
		type: CardType.Building,
		cost: 11,
		categories: [CardCategory.Plant],
		conditions: [gameProgressConditionMin('temperature', -16 / 2)],
		playEffects: [productionChange('plants', 1), resourceChange('plants', 3)]
	}),
	card({
		code: 'heather',
		type: CardType.Building,
		cost: 6,
		categories: [CardCategory.Plant],
		conditions: [gameProgressConditionMin('temperature', -14 / 2)],
		playEffects: [productionChange('plants', 1), resourceChange('plants', 1)]
	}),
	card({
		code: 'peroxide_power',
		type: CardType.Building,
		cost: 7,
		categories: [CardCategory.Building, CardCategory.Power],
		playEffects: [productionChange('money', -1), productionChange('energy', 2)]
	}),
	card({
		code: 'research',
		type: CardType.Building,
		cost: 11,
		categories: [CardCategory.Science, CardCategory.Science],
		victoryPoints: 1,
		playEffects: [getTopCards(2)]
	}),
	card({
		code: 'gene_repair',
		type: CardType.Building,
		cost: 12,
		categories: [CardCategory.Science],
		special: [CardSpecial.CorporationsEra],
		victoryPoints: 2,
		conditions: [cardCountCondition(CardCategory.Science, 3)],
		playEffects: [productionChange('money', 2)]
	}),
	card({
		code: 'io_mining_industries_',
		type: CardType.Building,
		cost: 41,
		categories: [CardCategory.Space, CardCategory.Jupiter],
		special: [CardSpecial.CorporationsEra],
		playEffects: [productionChange('titan', 2), productionChange('money', 2)],
		victoryPointsCallback: vpsForCards(CardCategory.Jupiter, 1)
	}),
	card({
		code: 'bushes',
		type: CardType.Building,
		cost: 10,
		categories: [CardCategory.Plant],
		conditions: [gameProgressConditionMin('temperature', -10 / 2)],
		playEffects: [productionChange('plants', 2), resourceChange('plants', 2)]
	}),
	card({
		code: 'mass_converter',
		type: CardType.Effect,
		cost: 8,
		categories: [CardCategory.Power, CardCategory.Science],
		special: [CardSpecial.CorporationsEra],
		conditions: [cardCountCondition(CardCategory.Science, 5)],
		playEffects: [spaceCardPriceChange(-2), productionChange('energy', 6)]
	}),
	card({
		code: 'physics_complex',
		type: CardType.Action,
		cost: 12,
		categories: [CardCategory.Building, CardCategory.Science],
		special: [CardSpecial.CorporationsEra],
		resource: 'science',
		actionEffects: [
			withRightArrow(resourceChange('energy', -6)),
			cardResourceChange('science', 1)
		],
		victoryPointsCallback: vpsForCardResources('science', 2)
	}),
	card({
		code: 'greenhouses',
		type: CardType.Building,
		cost: 6,
		categories: [CardCategory.Building, CardCategory.Plant],
		playEffects: [resourcesForTiles(GridCellContent.City, 'plants', 1)]
	}),
	card({
		code: 'nuclear_zone',
		type: CardType.Building,
		cost: 10,
		categories: [CardCategory.Earth],
		victoryPoints: -2,
		playEffects: [
			placeTile({
				type: GridCellContent.Other,
				other: GridCellOther.NuclearZone
			}),
			gameProcessChange('temperature', 2)
		]
	}),
	card({
		code: 'tropical_resort',
		type: CardType.Building,
		cost: 13,
		categories: [CardCategory.Building],
		special: [CardSpecial.CorporationsEra],
		victoryPoints: 2,
		playEffects: [productionChange('heat', -2), productionChange('money', 3)]
	}),
	card({
		code: 'toll_station',
		type: CardType.Building,
		cost: 12,
		categories: [CardCategory.Space],
		special: [CardSpecial.CorporationsEra],
		playEffects: [productionForPlayersTags(CardCategory.Space, 'money', 1)]
	}),
	card({
		code: 'fueled_generators',
		type: CardType.Building,
		cost: 1,
		categories: [CardCategory.Building, CardCategory.Power],
		playEffects: [productionChange('money', -1), productionChange('energy', 1)]
	}),
	card({
		code: 'ironworks',
		type: CardType.Action,
		cost: 11,
		categories: [CardCategory.Building],
		actionEffects: [
			withRightArrow(resourceChange('energy', -4)),
			resourceChange('ore', 1),
			gameProcessChange('oxygen', 1)
		]
	}),
	card({
		code: 'power_grid',
		type: CardType.Building,
		cost: 18,
		categories: [CardCategory.Power],
		playEffects: [productionForTags(CardCategory.Power, 'energy', 1)]
	}),
	card({
		code: 'steelworks',
		type: CardType.Action,
		cost: 15,
		categories: [CardCategory.Building],
		actionEffects: [
			withRightArrow(resourceChange('energy', -4)),
			resourceChange('ore', 2),
			gameProcessChange('oxygen', 1)
		]
	}),
	card({
		code: 'ore_processor',
		type: CardType.Action,
		cost: 13,
		categories: [CardCategory.Building],
		actionEffects: [
			withRightArrow(resourceChange('energy', -4)),
			resourceChange('titan', 1),
			gameProcessChange('oxygen', 1)
		]
	}),
	card({
		code: 'earth_office',
		type: CardType.Effect,
		cost: 1,
		categories: [CardCategory.Earth],
		special: [CardSpecial.CorporationsEra],
		playEffects: [earthCardPriceChange(-3)]
	}),
	card({
		code: 'acquired_company',
		type: CardType.Building,
		cost: 10,
		categories: [CardCategory.Earth],
		special: [CardSpecial.CorporationsEra],
		playEffects: [productionChange('money', 3)]
	}),
	card({
		code: 'media_archives',
		type: CardType.Building,
		cost: 8,
		categories: [CardCategory.Earth],
		special: [CardSpecial.CorporationsEra],
		playEffects: [resourcesForPlayersTags(CardCategory.Event, 'money', 1)]
	}),
	card({
		code: 'open_city',
		type: CardType.Building,
		cost: 23,
		categories: [CardCategory.Building, CardCategory.City],
		victoryPoints: 1,
		conditions: [gameProgressConditionMin('oxygen', 12)],
		playEffects: [
			resourceChange('plants', 2),
			productionChange('energy', -1),
			productionChange('money', 4),
			placeTile({ type: GridCellContent.City })
		]
	}),
	card({
		code: 'media_group',
		type: CardType.Effect,
		cost: 6,
		categories: [CardCategory.Earth],
		special: [CardSpecial.CorporationsEra],
		passiveEffects: [resourcePerCardPlayed([CardCategory.Event], 'money', 3)]
	}),
	card({
		code: 'business_network',
		type: CardType.Action,
		cost: 4,
		categories: [CardCategory.Earth],
		special: [CardSpecial.CorporationsEra],
		playEffects: [productionChange('money', -1)],
		actionEffects: [pickTopCards(1)]
	}),
	card({
		code: 'business_contacts',
		type: CardType.Event,
		cost: 7,
		categories: [CardCategory.Event, CardCategory.Earth],
		special: [CardSpecial.CorporationsEra],
		conditions: [gameProgressConditionMin('temperature', 4 / 2)],
		playEffects: [pickTopCards(4, 2, true)]
	}),
	card({
		code: 'bribed_committee',
		type: CardType.Event,
		cost: 7,
		categories: [CardCategory.Event, CardCategory.Earth],
		special: [CardSpecial.CorporationsEra],
		victoryPoints: -2,
		playEffects: [terraformRatingChange(2)]
	}),
	card({
		code: 'solar_power',
		type: CardType.Building,
		cost: 11,
		categories: [CardCategory.Building, CardCategory.Power],
		victoryPoints: 1,
		playEffects: [productionChange('energy', 1)]
	}),
	card({
		code: 'breathing_filters',
		type: CardType.Building,
		cost: 11,
		categories: [CardCategory.Science],
		victoryPoints: 2,
		conditions: [gameProgressConditionMin('oxygen', 7)]
	}),
	card({
		code: 'artificial_photosynthesis',
		type: CardType.Building,
		cost: 12,
		categories: [CardCategory.Science],
		playEffects: [
			effectChoice([
				productionChange('plants', 1),
				productionChange('energy', 2)
			])
		]
	}),
	card({
		code: 'artificial_lake',
		type: CardType.Building,
		cost: 15,
		categories: [CardCategory.Building],
		victoryPoints: 1,
		conditions: [gameProgressConditionMin('temperature', -6 / 2)],
		playEffects: [
			placeTile({
				type: GridCellContent.Ocean,
				conditions: [PlacementCode.NoOceans]
			})
		]
	}),
	card({
		code: 'geothermal_power',
		type: CardType.Building,
		cost: 11,
		categories: [CardCategory.Building, CardCategory.Power],
		playEffects: [productionChange('energy', 2)]
	}),
	card({
		code: 'farming',
		type: CardType.Building,
		cost: 16,
		categories: [CardCategory.Plant],
		victoryPoints: 2,
		conditions: [gameProgressConditionMin('temperature', 4 / 2)],
		playEffects: [
			productionChange('money', 2),
			productionChange('plants', 2),
			resourceChange('plants', 2)
		]
	}),
	card({
		code: 'dust_seals',
		type: CardType.Building,
		cost: 2,
		categories: [],
		victoryPoints: 1,
		conditions: [gameProgressConditionMax('oceans', 3)]
	}),
	card({
		code: 'urbanized_area',
		type: CardType.Building,
		cost: 10,
		categories: [CardCategory.Building, CardCategory.City],
		playEffects: [
			productionChange('energy', -2),
			productionChange('money', 2),
			placeTile({
				type: GridCellContent.City,
				conditions: [PlacementCode.NoOceans, PlacementCode.TwoCities]
			})
		]
	}),
	card({
		code: 'sabotage',
		type: CardType.Event,
		cost: 1,
		categories: [CardCategory.Event],
		special: [CardSpecial.CorporationsEra],
		playEffects: [
			effectChoice([
				playerResourceChange('titan', -3),
				playerResourceChange('ore', -4),
				playerResourceChange('money', -7)
			])
		]
	}),
	card({
		code: 'moss',
		type: CardType.Building,
		cost: 4,
		categories: [CardCategory.Plant],
		conditions: [gameProgressConditionMin('oceans', 3)],
		playEffects: [resourceChange('plants', -1), productionChange('plants', 1)]
	}),
	card({
		code: 'industrial_center',
		type: CardType.Action,
		cost: 4,
		categories: [CardCategory.Building],
		special: [CardSpecial.CorporationsEra],
		playEffects: [
			placeTile({
				type: GridCellContent.Other,
				other: GridCellOther.IndustrialCenter,
				conditions: [...OtherPlacement, PlacementCode.OneCity]
			})
		],
		actionEffects: [
			withRightArrow(resourceChange('money', -7)),
			productionChange('ore', 1)
		]
	}),
	card({
		code: 'hired_raiders',
		type: CardType.Event,
		cost: 1,
		categories: [CardCategory.Event],
		special: [CardSpecial.CorporationsEra],
		playEffects: [
			effectChoice([
				joinedEffects([
					playerResourceChange('ore', -2, false),
					resourceChange('ore', 2)
				]),
				joinedEffects([
					playerResourceChange('money', -3, false),
					resourceChange('money', 3)
				])
			])
		]
	}),
	card({
		code: 'hackers',
		type: CardType.Building,
		cost: 3,
		categories: [],
		special: [CardSpecial.CorporationsEra],
		victoryPoints: -1,
		playEffects: [
			productionChange('energy', -1),
			playerProductionChange('money', -2),
			productionChange('money', 2)
		]
	}),
	card({
		code: 'ghg_factories',
		type: CardType.Building,
		cost: 11,
		categories: [CardCategory.Building],
		playEffects: [productionChange('energy', -1), productionChange('heat', 4)]
	}),
	card({
		code: 'subterranean_reservoir',
		type: CardType.Event,
		cost: 11,
		categories: [CardCategory.Event],
		playEffects: [placeOcean()]
	}),
	card({
		code: 'ecological_zone',
		type: CardType.Effect,
		cost: 12,
		categories: [CardCategory.Plant, CardCategory.Animal],
		conditions: [ownedCellTypeCondition(GridCellContent.Forest, 1)],
		resource: 'animals',
		playEffects: [
			placeTile({
				type: GridCellContent.Other,
				other: GridCellOther.EcologicalZone,
				conditions: [...OtherPlacement, PlacementCode.OneForest]
			})
		],
		passiveEffects: [
			cardResourcePerCardPlayed(
				[CardCategory.Microbe, CardCategory.Animal],
				'animals',
				1
			)
		],
		victoryPointsCallback: vpsForCardResources('animals', 1 / 2)
	}),
	card({
		code: 'zeppelins',
		type: CardType.Building,
		cost: 13,
		categories: [],
		victoryPoints: 1,
		conditions: [gameProgressConditionMin('oxygen', 5)],
		playEffects: [productionForTiles(GridCellContent.City, 'money', 1)]
	}),
	card({
		code: 'worms',
		type: CardType.Building,
		cost: 8,
		categories: [CardCategory.Microbe],
		conditions: [gameProgressConditionMin('oxygen', 4)],
		playEffects: [productionForTags(CardCategory.Microbe, 'plants', 1)]
	}),
	card({
		code: 'decomposers',
		type: CardType.Effect,
		cost: 5,
		categories: [CardCategory.Microbe],
		conditions: [gameProgressConditionMin('oxygen', 3)],
		resource: 'microbes',
		passiveEffects: [
			cardResourcePerCardPlayed(
				[CardCategory.Microbe, CardCategory.Animal, CardCategory.Plant],
				'microbes',
				1
			)
		],
		victoryPointsCallback: vpsForCardResources('microbes', 1 / 3)
	}),
	card({
		code: 'fusion_power',
		type: CardType.Building,
		cost: 14,
		categories: [
			CardCategory.Building,
			CardCategory.Power,
			CardCategory.Science
		],
		conditions: [cardCountCondition(CardCategory.Power, 2)],
		playEffects: [productionChange('energy', 3)]
	}),
	card({
		code: 'symbiotic_fungus',
		type: CardType.Action,
		cost: 4,
		categories: [CardCategory.Microbe],
		conditions: [gameProgressConditionMin('temperature', -14 / 2)],
		actionEffects: [otherCardResourceChange('microbes', 1)]
	}),
	card({
		code: 'extreme_cold_fungus',
		type: CardType.Action,
		cost: 13,
		categories: [CardCategory.Microbe],
		conditions: [gameProgressConditionMax('temperature', -10 / 2)],
		actionEffects: [
			effectChoice([
				resourceChange('plants', 1),
				otherCardResourceChange('microbes', 2)
			])
		]
	}),
	card({
		code: 'advanced_ecosystems',
		type: CardType.Building,
		cost: 11,
		categories: [CardCategory.Animal, CardCategory.Microbe, CardCategory.Plant],
		victoryPoints: 3,
		conditions: [
			joinedCardCountCondition([
				{ category: CardCategory.Plant, value: 1 },
				{ category: CardCategory.Microbe, value: 1 },
				{ category: CardCategory.Animal, value: 1 }
			])
		]
	}),
	card({
		code: 'great_dam',
		type: CardType.Building,
		cost: 12,
		categories: [CardCategory.Building, CardCategory.Power],
		victoryPoints: 1,
		conditions: [gameProgressConditionMin('oceans', 4)],
		playEffects: [productionChange('energy', 2)]
	}),
	card({
		code: 'cartel',
		type: CardType.Building,
		cost: 8,
		categories: [CardCategory.Earth],
		special: [CardSpecial.CorporationsEra],
		playEffects: [productionForTags(CardCategory.Earth, 'money', 1)]
	}),
	card({
		code: 'strip_mine',
		type: CardType.Building,
		cost: 25,
		categories: [CardCategory.Building],
		playEffects: [
			productionChange('energy', -2),
			productionChange('ore', 2),
			productionChange('titan', 1)
		]
	}),
	card({
		code: 'wave_power',
		type: CardType.Building,
		cost: 8,
		categories: [CardCategory.Power],
		victoryPoints: 1,
		conditions: [gameProgressConditionMin('oceans', 3)],
		playEffects: [productionChange('energy', 1)]
	}),
	card({
		code: 'lava_flows',
		type: CardType.Event,
		cost: 18,
		categories: [CardCategory.Event],
		playEffects: [
			gameProcessChange('temperature', 2),
			placeTile({
				type: GridCellContent.Other,
				other: GridCellOther.Volcano,
				special: LavaCells
			})
		]
	}),
	card({
		code: 'power_plant',
		type: CardType.Building,
		cost: 4,
		categories: [CardCategory.Building, CardCategory.Power],
		playEffects: [productionChange('energy', 1)]
	}),
	card({
		code: 'mohole_area',
		type: CardType.Building,
		cost: 20,
		categories: [CardCategory.Building],
		playEffects: [
			productionChange('heat', 4),
			placeTile({
				type: GridCellContent.Other,
				other: GridCellOther.Mohole,
				conditions: [PlacementCode.OceanOnly]
			})
		]
	}),
	card({
		code: 'large_convoy',
		type: CardType.Event,
		cost: 36,
		categories: [CardCategory.Event, CardCategory.Space, CardCategory.Earth],
		victoryPoints: 2,
		playEffects: [
			placeOcean(),
			getTopCards(2),
			effectChoice([
				resourceChange('plants', 5),
				otherCardResourceChange('animals', 4)
			])
		]
	}),
	card({
		code: 'titanium_mine',
		type: CardType.Building,
		cost: 7,
		categories: [CardCategory.Building],
		special: [CardSpecial.CorporationsEra],
		playEffects: [productionChange('titan', 1)]
	}),
	card({
		code: 'tectonic_stress_power',
		type: CardType.Building,
		cost: 18,
		categories: [CardCategory.Building, CardCategory.Power],
		victoryPoints: 1,
		conditions: [cardCountCondition(CardCategory.Science, 2)],
		playEffects: [productionChange('energy', 3)]
	}),
	card({
		code: 'nitrophilic_moss',
		type: CardType.Building,
		cost: 8,
		categories: [CardCategory.Plant],
		conditions: [gameProgressConditionMin('oceans', 3)],
		playEffects: [resourceChange('plants', -2), productionChange('plants', 2)]
	}),
	card({
		code: 'herbivores',
		type: CardType.Effect,
		cost: 12,
		categories: [CardCategory.Animal],
		resource: 'animals',
		conditions: [gameProgressConditionMin('oxygen', 8)],
		playEffects: [
			cardResourceChange('animals', 1),
			playerProductionChange('plants', -1)
		],
		passiveEffects: [
			cardResourcePerTilePlaced(GridCellContent.Forest, 'animals', 1)
		],
		victoryPointsCallback: vpsForCardResources('animals', 1 / 2)
	}),
	card({
		code: 'insects',
		type: CardType.Building,
		cost: 9,
		categories: [CardCategory.Microbe],
		conditions: [gameProgressConditionMin('oxygen', 6)],
		playEffects: [productionForTags(CardCategory.Plant, 'plants', 1)]
	}),
	card({
		code: 'ceos_favorite_project',
		type: CardType.Event,
		cost: 1,
		categories: [CardCategory.Event],
		special: [CardSpecial.CorporationsEra],
		playEffects: [addResourceToCard()]
	}),
	card({
		code: 'anti_gravity_technology',
		type: CardType.Effect,
		cost: 14,
		categories: [CardCategory.Science],
		special: [CardSpecial.CorporationsEra],
		victoryPoints: 3,
		conditions: [cardCountCondition(CardCategory.Science, 7)],
		playEffects: [cardPriceChange(-2)]
	}),
	card({
		code: 'investment_loan',
		type: CardType.Event,
		cost: 3,
		categories: [CardCategory.Event, CardCategory.Earth],
		special: [CardSpecial.CorporationsEra],
		playEffects: [productionChange('money', -1), resourceChange('money', 10)]
	}),
	card({
		code: 'insulation',
		type: CardType.Building,
		cost: 2,
		categories: [],
		playEffects: [exchangeProduction('heat', 'money')]
	}),
	card({
		code: 'adaptation_technology',
		type: CardType.Effect,
		cost: 12,
		categories: [CardCategory.Science],
		victoryPoints: 1,
		playEffects: [changeProgressConditionBonus(2)]
	}),
	card({
		code: 'caretaker_contract',
		type: CardType.Action,
		cost: 3,
		categories: [],
		special: [CardSpecial.CorporationsEra],
		conditions: [gameProgressConditionMin('temperature', 0 / 2)],
		actionEffects: [
			withRightArrow(resourceChange('heat', -8)),
			terraformRatingChange(1)
		]
	}),
	card({
		code: 'designed_microorganisms',
		type: CardType.Building,
		cost: 16,
		categories: [CardCategory.Microbe, CardCategory.Science],
		conditions: [gameProgressConditionMax('temperature', -14 / 2)],
		playEffects: [productionChange('plants', 2)]
	}),
	card({
		code: 'standard_technology',
		type: CardType.Effect,
		cost: 6,
		categories: [CardCategory.Science],
		special: [CardSpecial.CorporationsEra],
		passiveEffects: [resourceForStandardProject('money', 3)]
	}),
	card({
		code: 'nitrite_reducing_bacteria',
		type: CardType.Action,
		cost: 11,
		categories: [CardCategory.Microbe],
		resource: 'microbes',
		playEffects: [cardResourceChange('microbes', 3)],
		actionEffects: [
			effectChoice([
				cardResourceChange('microbes', 1),
				joinedEffects([
					withRightArrow(cardResourceChange('microbes', -3)),
					terraformRatingChange(1)
				])
			])
		]
	}),
	card({
		code: 'industrial_microbes',
		type: CardType.Building,
		cost: 12,
		categories: [CardCategory.Building, CardCategory.Microbe],
		playEffects: [productionChange('energy', 1), productionChange('ore', 1)]
	}),
	card({
		code: 'lichen',
		type: CardType.Building,
		cost: 7,
		categories: [CardCategory.Plant],
		conditions: [gameProgressConditionMin('temperature', -24 / 2)],
		playEffects: [productionChange('plants', 1)]
	}),
	card({
		code: 'power_supply_consortium',
		type: CardType.Building,
		cost: 5,
		categories: [CardCategory.Power],
		special: [CardSpecial.CorporationsEra],
		playEffects: [
			playerProductionChange('energy', -1),
			productionChange('energy', 1)
		]
	}),
	card({
		code: 'convoy_from_europa',
		type: CardType.Event,
		cost: 15,
		categories: [CardCategory.Event, CardCategory.Space],
		playEffects: [placeOcean(), getTopCards(1)]
	}),
	card({
		code: 'imported_ghg',
		type: CardType.Event,
		cost: 7,
		categories: [CardCategory.Event, CardCategory.Space, CardCategory.Earth],
		playEffects: [productionChange('heat', 1), resourceChange('heat', 3)]
	}),
	card({
		code: 'imported_nitrogen',
		type: CardType.Event,
		cost: 23,
		categories: [CardCategory.Event, CardCategory.Space, CardCategory.Earth],
		playEffects: [
			terraformRatingChange(1),
			resourceChange('plants', 4),
			otherCardResourceChange('microbes', 3),
			otherCardResourceChange('animals', 2)
		]
	}),
	card({
		code: 'micro_mills',
		type: CardType.Building,
		cost: 3,
		categories: [],
		playEffects: [productionChange('heat', 1)]
	}),
	card({
		code: 'magnetic_field_generators',
		type: CardType.Building,
		cost: 20,
		categories: [CardCategory.Building],
		playEffects: [
			productionChange('energy', -4),
			productionChange('plants', 2),
			terraformRatingChange(3)
		]
	}),
	card({
		code: 'shuttles',
		type: CardType.Effect,
		cost: 10,
		categories: [CardCategory.Space],
		victoryPoints: 1,
		conditions: [gameProgressConditionMin('oxygen', 5)],
		playEffects: [
			spaceCardPriceChange(-2),
			productionChange('energy', -1),
			productionChange('money', 2)
		]
	}),
	card({
		code: 'import_of_advanced_ghg',
		type: CardType.Event,
		cost: 9,
		categories: [CardCategory.Event, CardCategory.Space, CardCategory.Earth],
		playEffects: [productionChange('heat', 2)]
	}),
	card({
		code: 'windmills',
		type: CardType.Building,
		cost: 6,
		categories: [CardCategory.Building, CardCategory.Power],
		victoryPoints: 1,
		conditions: [gameProgressConditionMin('oxygen', 7)],
		playEffects: [productionChange('energy', 1)]
	}),
	card({
		code: 'tundra_farming',
		type: CardType.Building,
		cost: 16,
		categories: [CardCategory.Plant],
		victoryPoints: 2,
		conditions: [gameProgressConditionMin('temperature', -6 / 2)],
		playEffects: [
			productionChange('plants', 1),
			productionChange('money', 2),
			resourceChange('plants', 1)
		]
	}),
	card({
		code: 'aerobraked_ammonia_asteroid',
		type: CardType.Event,
		cost: 26,
		categories: [CardCategory.Event, CardCategory.Space],
		playEffects: [
			productionChange('heat', 3),
			productionChange('plants', 1),
			otherCardResourceChange('microbes', 2)
		]
	}),
	card({
		code: 'magnetic_field_dome',
		type: CardType.Building,
		cost: 5,
		categories: [CardCategory.Building],
		playEffects: [
			productionChange('energy', -2),
			productionChange('plants', 1),
			terraformRatingChange(1)
		]
	}),
	card({
		code: 'pets',
		type: CardType.Effect,
		cost: 10,
		resourceProtected: true,
		resource: 'animals',
		categories: [CardCategory.Animal, CardCategory.Earth],
		playEffects: [cardResourceChange('animals', 1)],
		passiveEffects: [
			emptyPassiveEffect('Animals cannot be removed from this card'),
			cardResourcePerAnybodyTilePlaced(GridCellContent.City, 'animals', 1)
		],
		victoryPointsCallback: vpsForCardResources('animals', 1 / 2)
	}),
	card({
		code: 'protected_habitats',
		type: CardType.Action,
		cost: 5,
		categories: [],
		special: [CardSpecial.CorporationsEra],
		playEffects: [protectedHabitat()]
	}),
	card({
		code: 'protected_valley',
		type: CardType.Building,
		cost: 23,
		categories: [CardCategory.Building, CardCategory.Plant],
		playEffects: [
			productionChange('money', 2),
			placeTile({
				type: GridCellContent.Forest,
				conditions: [PlacementCode.OceanOnly]
			})
		]
	}),
	card({
		code: 'satellites',
		type: CardType.Building,
		cost: 10,
		categories: [CardCategory.Space],
		special: [CardSpecial.CorporationsEra],
		playEffects: [productionForTags(CardCategory.Space, 'money', 1)]
	}),
	card({
		code: 'noctis_farming',
		type: CardType.Building,
		cost: 10,
		categories: [CardCategory.Plant, CardCategory.Building],
		victoryPoints: 1,
		conditions: [gameProgressConditionMin('temperature', -20 / 2)],
		playEffects: [productionChange('money', 1), resourceChange('plants', 2)]
	}),
	card({
		code: 'water_splitting_plant',
		type: CardType.Action,
		cost: 12,
		categories: [CardCategory.Building],
		conditions: [gameProgressConditionMin('oceans', 2)],
		actionEffects: [
			withRightArrow(resourceChange('energy', -3)),
			gameProcessChange('oxygen', 1)
		]
	}),
	card({
		code: 'heat_trappers',
		type: CardType.Building,
		cost: 6,
		categories: [CardCategory.Building, CardCategory.Power],
		victoryPoints: -1,
		playEffects: [
			playerProductionChange('heat', -2),
			productionChange('energy', 1)
		]
	}),
	card({
		code: 'soil_factory',
		type: CardType.Building,
		cost: 9,
		categories: [CardCategory.Building],
		victoryPoints: 1,
		playEffects: [productionChange('energy', -1), productionChange('plants', 1)]
	}),
	card({
		code: 'fuel_factory',
		type: CardType.Building,
		cost: 6,
		categories: [CardCategory.Building],
		special: [CardSpecial.CorporationsEra],
		playEffects: [
			productionChange('energy', -1),
			productionChange('titan', 1),
			productionChange('money', 1)
		]
	}),
	card({
		code: 'ice_cap_melting',
		type: CardType.Event,
		cost: 5,
		categories: [CardCategory.Event],
		conditions: [gameProgressConditionMin('temperature', 2 / 2)],
		playEffects: [placeOcean()]
	}),
	card({
		code: 'corporate_stronghold',
		type: CardType.Building,
		cost: 11,
		categories: [CardCategory.Building, CardCategory.City],
		special: [CardSpecial.CorporationsEra],
		victoryPoints: -2,
		playEffects: [
			productionChange('energy', -1),
			productionChange('money', 3),
			placeTile({ type: GridCellContent.City })
		]
	}),
	card({
		code: 'biomass_combustors',
		type: CardType.Building,
		cost: 4,
		categories: [CardCategory.Building, CardCategory.Power],
		victoryPoints: -1,
		conditions: [gameProgressConditionMin('oxygen', 6)],
		playEffects: [
			playerProductionChange('plants', -1),
			productionChange('energy', 2)
		]
	}),
	card({
		code: 'livestock',
		type: CardType.Action,
		cost: 13,
		categories: [CardCategory.Animal],
		resource: 'animals',
		conditions: [gameProgressConditionMin('oxygen', 9)],
		playEffects: [productionChange('plants', -1), productionChange('money', 2)],
		actionEffects: [cardResourceChange('animals', 1)],
		victoryPointsCallback: vpsForCardResources('animals', 1)
	}),
	card({
		code: 'olympus_conference',
		type: CardType.Effect,
		cost: 10,
		resource: 'science',
		categories: [
			CardCategory.Building,
			CardCategory.Earth,
			CardCategory.Science
		],
		special: [CardSpecial.CorporationsEra],
		victoryPoints: 1,
		actionEffects: [
			effectChoice([
				cardResourceChange('science', 1),
				joinedEffects([
					withRightArrow(cardResourceChange('science', -1)),
					getTopCards(1)
				])
			])
		],
		passiveEffects: [playWhenCard([CardCategory.Science])]
	}),
	card({
		code: 'rad_suits',
		type: CardType.Building,
		cost: 6,
		categories: [],
		special: [CardSpecial.CorporationsEra],
		victoryPoints: 1,
		conditions: [gameProgressConditionMin('temperature', 2 / 2)],
		playEffects: [productionChange('money', 1)]
	}),
	card({
		code: 'aquifer_pumping',
		type: CardType.Action,
		cost: 18,
		categories: [CardCategory.Building],
		actionEffects: [moneyOrResForOcean('ore', 8)]
	}),
	card({
		code: 'flooding',
		type: CardType.Event,
		cost: 7,
		categories: [CardCategory.Event],
		playEffects: [placeOcean()],
		actionEffects: [changeResourceFromNeighbor('money', -4).action],
		passiveEffects: [changeResourceFromNeighbor('money', -4).effect],
		victoryPoints: -1
	}),
	card({
		code: 'energy_saving',
		type: CardType.Building,
		cost: 15,
		categories: [CardCategory.Power],
		playEffects: [productionForTiles(GridCellContent.City, 'energy', 1)]
	}),
	card({
		code: 'local_heat_trapping',
		type: CardType.Event,
		cost: 1,
		categories: [CardCategory.Event],
		playEffects: [
			resourceChange('heat', -5),
			effectChoice([
				resourceChange('plants', 4),
				otherCardResourceChange('animals', 2)
			])
		]
	}),
	card({
		code: 'permafrost_extraction',
		type: CardType.Event,
		cost: 8,
		categories: [CardCategory.Event],
		conditions: [gameProgressConditionMin('temperature', -8 / 2)],
		playEffects: [placeOcean()]
	}),
	card({
		code: 'invention_contest',
		type: CardType.Event,
		cost: 2,
		categories: [CardCategory.Event, CardCategory.Science],
		special: [CardSpecial.CorporationsEra],
		playEffects: [pickTopCards(3, 1, true)]
	}),
	card({
		code: 'plantation',
		type: CardType.Building,
		cost: 15,
		categories: [CardCategory.Plant],
		conditions: [cardCountCondition(CardCategory.Science, 2)],
		playEffects: [placeTile({ type: GridCellContent.Forest })]
	}),
	card({
		code: 'power_infrastructure',
		type: CardType.Action,
		cost: 4,
		categories: [CardCategory.Building, CardCategory.Power],
		special: [CardSpecial.CorporationsEra],
		actionEffects: [exchangeResources('energy', 'money')]
	}),
	card({
		code: 'indentured_workers',
		type: CardType.Event,
		cost: 0,
		categories: [CardCategory.Event],
		special: [CardSpecial.CorporationsEra],
		victoryPoints: -1,
		playEffects: [noDesc(cardPriceChange(-8))],
		passiveEffects: [resetCardPriceChange(-8)]
	}),
	card({
		code: 'lagrange_observatory',
		type: CardType.Building,
		cost: 9,
		categories: [CardCategory.Space, CardCategory.Science],
		special: [CardSpecial.CorporationsEra],
		victoryPoints: 1,
		playEffects: [getTopCards(1)]
	}),
	card({
		code: 'terraforming_ganymede',
		type: CardType.Building,
		cost: 33,
		categories: [CardCategory.Space, CardCategory.Jupiter],
		special: [CardSpecial.CorporationsEra],
		victoryPoints: 2,
		playEffects: [terraformRatingForTags(CardCategory.Jupiter, 1)]
	}),
	card({
		code: 'immigration_shuttles',
		type: CardType.Building,
		cost: 31,
		categories: [CardCategory.Space, CardCategory.Earth],
		playEffects: [productionChange('money', 5)],
		victoryPointsCallback: vpsForTiles(GridCellContent.City, 1 / 3)
	}),
	card({
		code: 'restricted_area',
		type: CardType.Action,
		cost: 11,
		categories: [CardCategory.Science],
		special: [CardSpecial.CorporationsEra],
		playEffects: [
			placeTile({
				type: GridCellContent.Other,
				other: GridCellOther.RestrictedZone
			})
		],
		actionEffects: [withRightArrow(resourceChange('money', -2)), getTopCards(1)]
	}),
	card({
		code: 'immigrant_city',
		type: CardType.Effect,
		cost: 13,
		categories: [CardCategory.Building, CardCategory.City],
		playEffects: [
			productionChange('energy', -1),
			productionChange('money', -2),
			placeTile({ type: GridCellContent.City })
		],
		passiveEffects: [productionPerPlacedTile(GridCellContent.City, 'money', 1)]
	}),
	card({
		code: 'energy_tapping',
		type: CardType.Building,
		cost: 3,
		categories: [CardCategory.Power],
		special: [CardSpecial.CorporationsEra],
		victoryPoints: -1,
		playEffects: [
			playerProductionChange('energy', -1),
			productionChange('energy', 1)
		]
	}),
	card({
		code: 'underground_detonations',
		type: CardType.Action,
		cost: 6,
		categories: [CardCategory.Building],
		actionEffects: [
			withRightArrow(resourceChange('money', -10)),
			productionChange('heat', 2)
		]
	}),
	card({
		code: 'soletta',
		type: CardType.Building,
		cost: 35,
		categories: [CardCategory.Space],
		playEffects: [productionChange('heat', 7)]
	}),
	card({
		code: 'technology_demonstration',
		type: CardType.Event,
		cost: 5,
		categories: [CardCategory.Event, CardCategory.Space, CardCategory.Science],
		special: [CardSpecial.CorporationsEra],
		playEffects: [getTopCards(2)]
	}),
	card({
		code: 'rad_chem_factory',
		type: CardType.Building,
		cost: 8,
		categories: [CardCategory.Building],
		playEffects: [productionChange('energy', -1), terraformRatingChange(2)]
	}),
	card({
		code: 'special_design',
		type: CardType.Event,
		cost: 4,
		categories: [CardCategory.Event, CardCategory.Science],
		playEffects: [noDesc(changeProgressConditionBonus(2))],
		passiveEffects: [resetProgressBonus(2)]
	}),
	card({
		code: 'medical_lab',
		type: CardType.Building,
		cost: 13,
		categories: [CardCategory.Building, CardCategory.Science],
		special: [CardSpecial.CorporationsEra],
		victoryPoints: 1,
		playEffects: [productionForTags(CardCategory.Building, 'money', 1 / 2)]
	}),
	card({
		code: 'ai_central',
		type: CardType.Action,
		cost: 21,
		categories: [CardCategory.Building, CardCategory.Science],
		special: [CardSpecial.CorporationsEra],
		victoryPoints: 1,
		conditions: [cardCountCondition(CardCategory.Science, 3)],
		playEffects: [productionChange('energy', -1)],
		actionEffects: [getTopCards(2)]
	})
]
