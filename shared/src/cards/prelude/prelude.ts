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
		title: 'Allied Banks',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Earth],
		special: [CardSpecial.Prelude],
		playEffects: [productionChange('money', 4), resourceChange('money', 3)]
	}),
	card({
		code: 'aquifer_turbines',
		title: 'Aquifer Turbines',
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
		title: 'Biofuels',
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
		title: 'Biolab',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Science],
		special: [CardSpecial.Prelude],
		playEffects: [productionChange('plants', 1), getTopCards(3)]
	}),
	card({
		code: 'biosphere_support',
		title: 'Biosphere Support',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Plant],
		special: [CardSpecial.Prelude],
		playEffects: [productionChange('money', -1), productionChange('plants', 2)]
	}),
	card({
		code: 'business_empire',
		title: 'Business Empire',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Earth],
		special: [CardSpecial.Prelude],
		playEffects: [productionChange('money', 6), resourceChange('money', -6)]
	}),
	card({
		code: 'dome_farming',
		title: 'Dome Farming',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Plant, CardCategory.Building],
		special: [CardSpecial.Prelude],
		playEffects: [productionChange('money', 2), productionChange('plants', 1)]
	}),
	card({
		code: 'donation',
		title: 'Donation',
		type: CardType.Prelude,
		cost: 0,
		categories: [],
		special: [CardSpecial.Prelude],
		playEffects: [resourceChange('money', 21)]
	}),
	card({
		code: 'early_settlement',
		title: 'Early Settlement',
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
		title: 'Ecology Experts',
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
		title: 'Eccentric Sponsor',
		type: CardType.Prelude,
		cost: 0,
		categories: [],
		special: [CardSpecial.Prelude],
		playEffects: [noDesc(cardPriceChange(-25))],
		passiveEffects: [resetCardPriceChange(-25)]
	}),
	card({
		code: 'experimental_forest',
		title: 'Experimental Forest',
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
		title: 'Galilean Mining',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Jupiter],
		special: [CardSpecial.Prelude],
		playEffects: [productionChange('titan', 2), resourceChange('money', -5)]
	}),
	card({
		code: 'great_aquifer',
		title: 'Great Aquifer',
		type: CardType.Prelude,
		cost: 0,
		categories: [],
		special: [CardSpecial.Prelude],
		playEffects: [placeOcean(), placeOcean()]
	}),
	card({
		code: 'huge_asteroid',
		title: 'Huge Asteroid',
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
		title: 'Io Research Outpost',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Jupiter, CardCategory.Science],
		special: [CardSpecial.Prelude],
		playEffects: [productionChange('titan', 1), getTopCards(1)]
	}),
	card({
		code: 'loan',
		title: 'Loan',
		type: CardType.Prelude,
		cost: 0,
		categories: [],
		special: [CardSpecial.Prelude],
		playEffects: [productionChange('money', -2), resourceChange('money', 30)]
	}),
	card({
		code: 'martian_industries',
		title: 'Martian Industries',
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
		title: 'Metal Rich Asteroid',
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
		title: 'Metals Company',
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
		title: 'Mining Operations',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Building],
		special: [CardSpecial.Prelude],
		playEffects: [productionChange('ore', 2), resourceChange('ore', 4)]
	}),
	card({
		code: 'mohole',
		title: 'Mohole',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Building],
		special: [CardSpecial.Prelude],
		playEffects: [productionChange('heat', 3), resourceChange('heat', 3)]
	}),
	card({
		code: 'mohole_excavation',
		title: 'Mohole Excavation',
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
		title: 'Nitrogen Shipment',
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
		title: 'Orbital Construction Yard',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Space],
		special: [CardSpecial.Prelude],
		playEffects: [productionChange('titan', 1), resourceChange('titan', 4)]
	}),
	card({
		code: 'polar_industries',
		title: 'Polar Industries',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Building],
		special: [CardSpecial.Prelude],
		playEffects: [productionChange('heat', 2), placeOcean()]
	}),
	card({
		code: 'power_generation',
		title: 'Power Generation',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Power],
		special: [CardSpecial.Prelude],
		playEffects: [productionChange('energy', 3)]
	}),
	card({
		code: 'research_network',
		title: 'Research Network',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Any],
		special: [CardSpecial.Prelude],
		playEffects: [productionChange('money', 1), getTopCards(3)]
	}),
	card({
		code: 'self_sufficient_settlement',
		title: 'Self-Sufficient Settlement',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Building, CardCategory.City],
		special: [CardSpecial.Prelude],
		playEffects: [productionChange('money', 2), placeCity()]
	}),
	card({
		code: 'smelting_plant',
		title: 'Smelting Plant',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Building],
		special: [CardSpecial.Prelude],
		playEffects: [gameProcessChange('oxygen', 2), resourceChange('ore', 5)]
	}),
	card({
		code: 'society_support',
		title: 'Society Support',
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
		title: 'Supplier',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Power],
		special: [CardSpecial.Prelude],
		playEffects: [productionChange('energy', 2), resourceChange('ore', 2)]
	}),
	card({
		code: 'supply_drop',
		title: 'Supply Drop',
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
		title: 'UNMI Contractor',
		type: CardType.Prelude,
		cost: 0,
		categories: [CardCategory.Earth],
		special: [CardSpecial.Prelude],
		playEffects: [terraformRatingChange(3), getTopCards(1)]
	}),
	card({
		code: 'acquired_space_agency',
		title: 'Acquired Space Agency',
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
