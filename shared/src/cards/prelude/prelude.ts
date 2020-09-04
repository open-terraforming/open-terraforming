import { Card, CardType, CardCategory, CardSpecial } from '../types'
import { card, noDesc } from '../utils'
import {
	productionChange,
	resourceChange,
	placeTile,
	getTopCards,
	changeProgressConditionBonus,
	cardPriceChange,
	getTopCardsWithTag,
	placeOcean,
	gameProcessChange,
	terraformRatingChange,
	placeCity
} from '../effects'
import { GridCellContent } from '../../game'
import { resetProgressBonus, resetCardPriceChange } from '../passive-effects'

export const preludePreludes: Card[] = [
	card({
		code: 'allied_banks',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Earth],
		special: [CardSpecial.Prelude],
		playEffects: [productionChange('money', 4), resourceChange('money', 3)]
	}),
	card({
		code: 'aquifer_turbines',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Power],
		special: [CardSpecial.Prelude],
		playEffects: [
			placeTile({ type: GridCellContent.Ocean }),
			productionChange('energy', 2),
			resourceChange('money', -3)
		]
	}),
	card({
		code: 'biofuels',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Microbe],
		special: [CardSpecial.Prelude],
		playEffects: [
			productionChange('energy', 1),
			productionChange('plants', 1),
			resourceChange('plants', 2)
		]
	}),
	card({
		code: 'biolab',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Science],
		special: [CardSpecial.Prelude],
		playEffects: [productionChange('plants', 1), getTopCards(3)]
	}),
	card({
		code: 'biosphere_support',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Plant],
		special: [CardSpecial.Prelude],
		playEffects: [productionChange('money', -1), productionChange('plants', 2)]
	}),
	card({
		code: 'business_empire',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Earth],
		special: [CardSpecial.Prelude],
		playEffects: [productionChange('money', 6), resourceChange('money', -6)]
	}),
	card({
		code: 'dome_farming',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Plant, CardCategory.Building],
		special: [CardSpecial.Prelude],
		playEffects: [productionChange('money', 2), productionChange('plants', 1)]
	}),
	card({
		code: 'donation',
		type: CardType.Prelude,
		cost: 0,
		categories: [],
		special: [CardSpecial.Prelude],
		playEffects: [resourceChange('money', 21)]
	}),
	card({
		code: 'early_settlement',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Building, CardCategory.City],
		special: [CardSpecial.Prelude],
		playEffects: [
			productionChange('plants', 1),
			placeTile({ type: GridCellContent.City })
		]
	}),
	card({
		code: 'ecology_experts',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Microbe, CardCategory.Plant],
		special: [CardSpecial.Prelude],
		playEffects: [
			productionChange('plants', 1),
			noDesc(changeProgressConditionBonus(30))
		],
		passiveEffects: [resetProgressBonus(30)]
	}),
	card({
		code: 'eccentric_sponsor',
		type: CardType.Prelude,
		cost: 0,
		categories: [],
		special: [CardSpecial.Prelude],
		playEffects: [noDesc(cardPriceChange(-25))],
		passiveEffects: [resetCardPriceChange(-25)]
	}),
	card({
		code: 'experimental_forest',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Plant],
		special: [CardSpecial.Prelude],
		playEffects: [
			placeTile({ type: GridCellContent.Forest }),
			getTopCardsWithTag(2, CardCategory.Plant)
		]
	}),
	card({
		code: 'galilean_mining',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Jupiter],
		special: [CardSpecial.Prelude],
		playEffects: [productionChange('titan', 2), resourceChange('money', -5)]
	}),
	card({
		code: 'great_aquifer',
		type: CardType.Prelude,
		cost: 0,
		categories: [],
		special: [CardSpecial.Prelude],
		playEffects: [placeOcean(), placeOcean()]
	}),
	card({
		code: 'huge_asteroid',
		type: CardType.Prelude,
		cost: 0,
		categories: [],
		special: [CardSpecial.Prelude],
		playEffects: [
			gameProcessChange('temperature', 3),
			resourceChange('money', -5)
		]
	}),
	card({
		code: 'io_research_outpost',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Jupiter, CardCategory.Science],
		special: [CardSpecial.Prelude],
		playEffects: [productionChange('titan', 1), getTopCards(1)]
	}),
	card({
		code: 'loan',
		type: CardType.Prelude,
		cost: 0,
		categories: [],
		special: [CardSpecial.Prelude],
		playEffects: [productionChange('money', -2), resourceChange('money', 30)]
	}),
	card({
		code: 'martian_industries',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Building],
		special: [CardSpecial.Prelude],
		playEffects: [
			productionChange('energy', 1),
			productionChange('ore', 1),
			resourceChange('money', 6)
		]
	}),
	card({
		code: 'metal_rich_asteroid',
		type: CardType.Prelude,
		cost: 0,
		categories: [],
		special: [CardSpecial.Prelude],
		playEffects: [
			gameProcessChange('temperature', 1),
			resourceChange('titan', 4),
			resourceChange('ore', 4)
		]
	}),
	card({
		code: 'metals_company',
		type: CardType.Prelude,
		cost: 0,
		categories: [],
		special: [CardSpecial.Prelude],
		playEffects: [
			productionChange('money', 1),
			productionChange('ore', 1),
			productionChange('titan', 1)
		]
	}),
	card({
		code: 'mining_operations',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Building],
		special: [CardSpecial.Prelude],
		playEffects: [productionChange('ore', 2), resourceChange('ore', 4)]
	}),
	card({
		code: 'mohole',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Building],
		special: [CardSpecial.Prelude],
		playEffects: [productionChange('heat', 3), resourceChange('heat', 3)]
	}),
	card({
		code: 'mohole_excavation',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Building],
		special: [CardSpecial.Prelude],
		playEffects: [
			productionChange('ore', 1),
			productionChange('heat', 2),
			resourceChange('heat', 2)
		]
	}),
	card({
		code: 'nitrogen_shipment',
		type: CardType.Prelude,
		cost: 0,
		categories: [],
		special: [CardSpecial.Prelude],
		playEffects: [
			productionChange('plants', 1),
			terraformRatingChange(1),
			resourceChange('money', 5)
		]
	}),
	card({
		code: 'orbital_construction_yard',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Space],
		special: [CardSpecial.Prelude],
		playEffects: [productionChange('titan', 1), resourceChange('titan', 4)]
	}),
	card({
		code: 'polar_industries',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Building],
		special: [CardSpecial.Prelude],
		playEffects: [productionChange('heat', 2), placeOcean()]
	}),
	card({
		code: 'power_generation',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Power],
		special: [CardSpecial.Prelude],
		playEffects: [productionChange('energy', 3)]
	}),
	card({
		code: 'research_network',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Any],
		special: [CardSpecial.Prelude],
		playEffects: [productionChange('money', 1), getTopCards(3)]
	}),
	card({
		code: 'self_sufficient_settlement',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Building, CardCategory.City],
		special: [CardSpecial.Prelude],
		playEffects: [productionChange('money', 2), placeCity()]
	}),
	card({
		code: 'smelting_plant',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Building],
		special: [CardSpecial.Prelude],
		playEffects: [gameProcessChange('oxygen', 2), resourceChange('ore', 5)]
	}),
	card({
		code: 'society_support',
		type: CardType.Prelude,
		cost: 0,
		categories: [],
		special: [CardSpecial.Prelude],
		playEffects: [
			productionChange('money', -1),
			productionChange('plants', 1),
			productionChange('energy', 1),
			productionChange('heat', 1)
		]
	}),
	card({
		code: 'supplier',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Power],
		special: [CardSpecial.Prelude],
		playEffects: [productionChange('energy', 2), resourceChange('ore', 2)]
	}),
	card({
		code: 'supply_drop',
		type: CardType.Prelude,
		cost: 0,
		categories: [],
		special: [CardSpecial.Prelude],
		playEffects: [
			resourceChange('titan', 3),
			resourceChange('ore', 8),
			resourceChange('plants', 3)
		]
	}),
	card({
		code: 'unmi_contractor',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Earth],
		special: [CardSpecial.Prelude],
		playEffects: [terraformRatingChange(3), getTopCards(1)]
	}),
	card({
		code: 'acquired_space_agency',
		type: CardType.Prelude,
		cost: 0,
		categories: [],
		special: [CardSpecial.Prelude],
		playEffects: [
			resourceChange('titan', 6),
			getTopCardsWithTag(2, CardCategory.Space)
		]
	})
]
