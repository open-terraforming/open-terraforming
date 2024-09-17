import {
	cardCategoryCountCondition,
	cardResourceAnywhereCondition,
	cellTypeCondition,
	gameProgressConditionMin,
	playerMaxColonyCountCondition,
	playerMinColonyCountCondition,
} from '@shared/cards/conditions'
import {
	anyCardResourceChange,
	cardResourceChange,
	effectChoice,
	getTopCards,
	joinedEffects,
	placeCity,
	placeOcean,
	playerProductionChange,
	playerResourceChange,
	productionChange,
	productionChangeForTags,
	productionForPlayersTags,
	resourceChange,
	resourcesForTiles,
	terraformRatingChange,
} from '@shared/cards/effectsGrouped'
import { changeColonyStep } from '@shared/cards/effects/changeColonyStep'
import { freeTradeWithColony } from '@shared/cards/effects/freeTradeWithColony'
import { gainAllColonyIncomeBonuses } from '@shared/cards/effects/gainAllColonyIncomeBonuses'
import { getTopCardsByTagCount } from '@shared/cards/effects/getTopCardsByTagCount'
import { placeColony } from '@shared/cards/effects/placeColony'
import { productionChangePerCardResource } from '@shared/cards/effects/productionChangePerCardResource'
import { productionChangePerColonyInPlay } from '@shared/cards/effects/productionChangePerColonyInPlay'
import { productionChangePerNoTags } from '@shared/cards/effects/productionChangePerNoTags'
import { productionChangePerOwnedColony } from '@shared/cards/effects/productionChangePerOwnedColony'
import { resourcePerCardResource } from '@shared/cards/effects/resourcePerCardResource'
import { resourcesForColonies } from '@shared/cards/effects/resourcesForColonies'
import { tradeFleetCountChange } from '@shared/cards/effects/tradeFleetCountChange'
import {
	cardResourcePerSelfTagPlayed,
	drawCardWhenBuyingCard,
	increaseIncomeStepBeforeTrading,
	resetCardPriceChange,
} from '@shared/cards/passive-effects'
import { cardPriceChange } from '@shared/cards/passive-effects/cardPriceChange'
import { colonyTradePriceChange } from '@shared/cards/passive-effects/colonyTradePriceChange'
import { tagPriceChange } from '@shared/cards/passive-effects/tagPriceChange'
import { CardCategory, CardSpecial, CardType } from '@shared/cards/types'
import { card, prependRightArrow, withRightArrow } from '@shared/cards/utils'
import { vpsForCardResources, vpsForColoniesInPlay } from '@shared/cards/vps'
import { GridCellContent } from '@shared/game'

export const coloniesCards = [
	card({
		code: 'airliners',
		cost: 11,
		type: CardType.Building,
		categories: [],
		conditions: [cardResourceAnywhereCondition('floaters', 3)],
		playEffects: [
			productionChange('money', 2),
			anyCardResourceChange('microbes', 2),
		],
		victoryPoints: 1,
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'air_raid',
		cost: 0,
		type: CardType.Action,
		categories: [CardCategory.Event],
		playEffects: [
			// TODO: Is this required?
			anyCardResourceChange('microbes', -1),
			playerResourceChange('money', -5),
			resourceChange('money', 5),
		],
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'atmo_collectors',
		cost: 15,
		type: CardType.Action,
		categories: [],
		resource: 'floaters',
		playEffects: [anyCardResourceChange('floaters', 2)],
		actionEffects: [
			effectChoice([
				cardResourceChange('floaters', 1),
				joinedEffects([
					withRightArrow(cardResourceChange('floaters', -1)),
					effectChoice(
						[
							resourceChange('titan', 2),
							resourceChange('energy', 3),
							resourceChange('heat', 4),
						],
						true,
					),
				]),
			]),
		],
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'community_services',
		cost: 13,
		type: CardType.Building,
		categories: [],
		playEffects: [productionChangePerNoTags('money', 1)],
		victoryPoints: 1,
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'conscription',
		cost: 5,
		type: CardType.Event,
		categories: [CardCategory.Earth, CardCategory.Event],
		conditions: [cardCategoryCountCondition(CardCategory.Earth, 2)],
		passiveEffects: [resetCardPriceChange(-16)],
		special: [CardSpecial.Colonies],
		victoryPoints: -2,
	}),
	card({
		code: 'corona_extractor',
		cost: 10,
		type: CardType.Building,
		categories: [CardCategory.Power, CardCategory.Space],
		conditions: [cardCategoryCountCondition(CardCategory.Science, 4)],
		playEffects: [productionChange('energy', 4)],
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'cryo_sleep',
		cost: 10,
		type: CardType.Effect,
		categories: [CardCategory.Science],
		passiveEffects: [colonyTradePriceChange(-1)],
		victoryPoints: 1,
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'earth_elevator',
		cost: 43,
		type: CardType.Building,
		categories: [CardCategory.Earth, CardCategory.Space],
		playEffects: [productionChange('titan', 3)],
		victoryPoints: 4,
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'ecology_research',
		cost: 21,
		type: CardType.Building,
		categories: [
			CardCategory.Science,
			CardCategory.Animal,
			CardCategory.Microbe,
			CardCategory.Plant,
		],
		playEffects: [
			productionChangePerOwnedColony('plants', 1),
			anyCardResourceChange('animals', 1),
			anyCardResourceChange('microbes', 2),
		],
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'floater_leasing',
		cost: 3,
		type: CardType.Building,
		categories: [],
		playEffects: [productionChangePerCardResource('money', 'floaters', 3)],
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'floater_prototypes',
		cost: 2,
		type: CardType.Event,
		categories: [CardCategory.Science, CardCategory.Event],
		playEffects: [anyCardResourceChange('floaters', 2)],
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'floater_technology',
		cost: 7,
		type: CardType.Action,
		categories: [CardCategory.Science],
		actionEffects: [anyCardResourceChange('floaters', 1)],
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'galilean_waystation',
		cost: 15,
		type: CardType.Building,
		categories: [CardCategory.Space],
		playEffects: [
			productionForPlayersTags(CardCategory.Jupiter, 'money', 1, true),
		],
		victoryPoints: 1,
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'heavy_taxation',
		cost: 3,
		type: CardType.Building,
		categories: [CardCategory.Earth],
		conditions: [cardCategoryCountCondition(CardCategory.Earth, 2)],
		playEffects: [productionChange('money', 2), resourceChange('money', 4)],
		victoryPoints: -1,
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'ice_moon_colony',
		cost: 23,
		type: CardType.Building,
		categories: [CardCategory.Space],
		playEffects: [placeOcean(), placeColony()],
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'impactor_swarm',
		cost: 11,
		type: CardType.Event,
		categories: [CardCategory.Space, CardCategory.Event],
		conditions: [cardCategoryCountCondition(CardCategory.Jupiter, 2)],
		playEffects: [
			resourceChange('heat', 12),
			playerResourceChange('plants', -2, true),
		],
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'interplanetary_colony_ship',
		cost: 12,
		type: CardType.Event,
		categories: [CardCategory.Earth, CardCategory.Space, CardCategory.Event],
		playEffects: [placeColony()],
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'jovian_lanterns',
		cost: 20,
		type: CardType.Action,
		categories: [CardCategory.Jupiter],
		conditions: [cardCategoryCountCondition(CardCategory.Jupiter, 1)],
		resource: 'floaters',
		victoryPointsCallback: vpsForCardResources('floaters', 1 / 2),
		playEffects: [
			terraformRatingChange(1),
			anyCardResourceChange('floaters', 2),
		],
		actionEffects: [
			withRightArrow(resourceChange('titan', -1)),
			cardResourceChange('floaters', 2),
		],
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'jupiter_floating_station',
		cost: 9,
		type: CardType.Action,
		categories: [CardCategory.Jupiter],
		conditions: [cardCategoryCountCondition(CardCategory.Science, 3)],
		resource: 'floaters',
		actionEffects: [
			effectChoice([
				prependRightArrow(
					anyCardResourceChange('floaters', 1, CardCategory.Jupiter),
				),
				resourcePerCardResource('money', 1, 'floaters', 4),
			]),
		],
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'luna_governor',
		cost: 4,
		type: CardType.Building,
		categories: [CardCategory.Earth, CardCategory.Earth],
		conditions: [cardCategoryCountCondition(CardCategory.Earth, 3)],
		playEffects: [productionChange('money', 2)],
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'lunar_exports',
		cost: 19,
		type: CardType.Building,
		categories: [CardCategory.Space, CardCategory.Earth],
		playEffects: [
			effectChoice([
				productionChange('plants', 2),
				productionChange('money', 5),
			]),
		],
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'lunar_mining',
		cost: 11,
		type: CardType.Building,
		categories: [CardCategory.Earth],
		playEffects: [productionChangeForTags('titan', 1, CardCategory.Earth, 2)],
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'market_manipulation',
		cost: 1,
		type: CardType.Event,
		categories: [CardCategory.Earth, CardCategory.Event],
		playEffects: [changeColonyStep(1), changeColonyStep(-1)],
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'martian_zoo',
		cost: 12,
		type: CardType.Action,
		categories: [CardCategory.Animal, CardCategory.Building],
		conditions: [cellTypeCondition(GridCellContent.City, 2)],
		passiveEffects: [
			cardResourcePerSelfTagPlayed(CardCategory.Earth, 'animals', 1),
		],
		resource: 'animals',
		actionEffects: [resourcePerCardResource('money', 1, 'animals')],
		victoryPoints: 1,
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'mining_colony',
		cost: 20,
		type: CardType.Building,
		categories: [CardCategory.Space],
		playEffects: [productionChange('titan', 1), placeColony()],
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'minority_refuge',
		cost: 5,
		type: CardType.Building,
		categories: [CardCategory.Space],
		playEffects: [productionChange('money', -2), placeColony()],
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'molecular_printing',
		cost: 11,
		type: CardType.Building,
		categories: [CardCategory.Science],
		playEffects: [
			resourcesForTiles(GridCellContent.City, 'money', 1, false),
			resourcesForColonies('money', 1),
		],
		special: [CardSpecial.Colonies],
		victoryPoints: 1,
	}),
	card({
		code: 'nitrogen_from_titan',
		cost: 25,
		type: CardType.Building,
		categories: [CardCategory.Jupiter, CardCategory.Space],
		playEffects: [
			terraformRatingChange(2),
			anyCardResourceChange('floaters', 2, CardCategory.Jupiter),
		],
		special: [CardSpecial.Colonies],
		victoryPoints: 1,
	}),
	card({
		code: 'pioneer_settlement',
		cost: 13,
		type: CardType.Building,
		categories: [],
		conditions: [playerMaxColonyCountCondition(1)],
		playEffects: [productionChange('money', -2), placeColony()],
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'productive_outpost',
		cost: 0,
		type: CardType.Building,
		categories: [],
		playEffects: [gainAllColonyIncomeBonuses()],
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'quantum_communications',
		cost: 8,
		type: CardType.Building,
		categories: [],
		conditions: [cardCategoryCountCondition(CardCategory.Science, 4)],
		playEffects: [productionChangePerColonyInPlay('money', 1)],
		victoryPoints: 1,
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'red_spot_observatory',
		cost: 17,
		type: CardType.Action,
		categories: [CardCategory.Science, CardCategory.Jupiter],
		conditions: [cardCategoryCountCondition(CardCategory.Science, 3)],
		playEffects: [getTopCards(2)],
		actionEffects: [
			effectChoice([
				prependRightArrow(anyCardResourceChange('floaters', 1)),
				joinedEffects([
					withRightArrow(cardResourceChange('floaters', -1)),
					getTopCards(1),
				]),
			]),
		],
		resource: 'floaters',
		victoryPoints: 2,
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'refugee_camps',
		cost: 10,
		type: CardType.Action,
		categories: [CardCategory.Earth],
		resource: 'camps',
		actionEffects: [
			joinedEffects(
				[
					withRightArrow(productionChange('money', -1)),
					cardResourceChange('camps', 1),
				],
				'to',
			),
		],
		victoryPointsCallback: vpsForCardResources('camps', 1),
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'research_colony',
		cost: 20,
		type: CardType.Building,
		categories: [CardCategory.Science, CardCategory.Space],
		playEffects: [
			placeColony({ allowMoreColoniesPerColony: true }),
			getTopCards(2),
		],
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'rim_freighters',
		cost: 4,
		type: CardType.Effect,
		categories: [CardCategory.Space],
		passiveEffects: [colonyTradePriceChange(-1)],
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'sky_docks',
		cost: 18,
		type: CardType.Effect,
		categories: [CardCategory.Earth, CardCategory.Space],
		conditions: [cardCategoryCountCondition(CardCategory.Earth, 2)],
		playEffects: [tradeFleetCountChange(1)],
		passiveEffects: [cardPriceChange(-1)],
		victoryPoints: 2,
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'solar_probe',
		cost: 9,
		type: CardType.Event,
		categories: [CardCategory.Science, CardCategory.Space, CardCategory.Event],
		playEffects: [getTopCardsByTagCount(CardCategory.Science, 3)],
		victoryPoints: 1,
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'solar_reflectors',
		cost: 23,
		type: CardType.Building,
		categories: [CardCategory.Space],
		playEffects: [productionChange('heat', 5)],
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'space_port',
		cost: 22,
		type: CardType.Building,
		categories: [CardCategory.City, CardCategory.Building],
		conditions: [playerMinColonyCountCondition(1)],
		playEffects: [
			productionChange('energy', -1),
			productionChange('money', 4),
			placeCity(),
			tradeFleetCountChange(1),
		],
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'space_port_colony',
		cost: 27,
		type: CardType.Building,
		categories: [CardCategory.Space],
		conditions: [playerMinColonyCountCondition(1)],
		playEffects: [
			placeColony({ allowMoreColoniesPerColony: true }),
			tradeFleetCountChange(1),
		],
		victoryPointsCallback: vpsForColoniesInPlay(1 / 2),
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'spin_off_department',
		cost: 10,
		type: CardType.Effect,
		categories: [CardCategory.Building],
		playEffects: [productionChange('money', 2)],
		passiveEffects: [drawCardWhenBuyingCard(20)],
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'sub_zero_salt_fish',
		cost: 5,
		type: CardType.Building,
		categories: [],
		conditions: [gameProgressConditionMin('temperature', -3)],
		actionEffects: [cardResourceChange('animals', 1)],
		playEffects: [playerProductionChange('plants', -1)],
		victoryPointsCallback: vpsForCardResources('animals', 1 / 2),
		resource: 'animals',
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'titanium_air_scrapping',
		cost: 21,
		type: CardType.Action,
		categories: [CardCategory.Jupiter],
		resource: 'floaters',
		actionEffects: [
			effectChoice([
				joinedEffects(
					[
						withRightArrow(resourceChange('titan', -1, true)),
						cardResourceChange('floaters', 2),
					],
					'to',
				),
				joinedEffects(
					[
						withRightArrow(cardResourceChange('floaters', -2)),
						terraformRatingChange(1),
					],
					'to',
				),
			]),
		],
		victoryPoints: 2,
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'titan_floating_launch_pad',
		cost: 18,
		type: CardType.Action,
		categories: [CardCategory.Jupiter],
		resource: 'floaters',
		playEffects: [anyCardResourceChange('floaters', 2, CardCategory.Jupiter)],
		actionEffects: [
			effectChoice([
				prependRightArrow(
					anyCardResourceChange('floaters', 1, CardCategory.Jupiter),
				),
				joinedEffects(
					[
						withRightArrow(cardResourceChange('floaters', -1)),
						freeTradeWithColony(),
					],
					'to',
				),
			]),
		],
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'titan_shuttles',
		cost: 23,
		type: CardType.Action,
		categories: [CardCategory.Jupiter],
		resource: 'floaters',
		actionEffects: [
			effectChoice([
				prependRightArrow(
					anyCardResourceChange('floaters', 2, CardCategory.Jupiter),
				),
				resourcePerCardResource('titan', 1, 'floaters'),
			]),
		],
		victoryPoints: 1,
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'trade_envoys',
		cost: 6,
		type: CardType.Effect,
		categories: [],
		passiveEffects: [increaseIncomeStepBeforeTrading(1)],
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'trading_colony',
		cost: 18,
		type: CardType.Effect,
		categories: [CardCategory.Space],
		playEffects: [placeColony()],
		passiveEffects: [increaseIncomeStepBeforeTrading(1)],
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'urban_decomposers',
		cost: 6,
		type: CardType.Building,
		categories: [CardCategory.Microbe],
		conditions: [
			cellTypeCondition(GridCellContent.City, 1),
			playerMinColonyCountCondition(1),
		],
		playEffects: [
			productionChange('plants', 1),
			anyCardResourceChange('microbes', 2),
		],
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'warp_drive',
		cost: 14,
		type: CardType.Effect,
		categories: [CardCategory.Space],
		conditions: [cardCategoryCountCondition(CardCategory.Science, 5)],
		passiveEffects: [tagPriceChange(CardCategory.Space, -4)],
		victoryPoints: 2,
		special: [CardSpecial.Colonies],
	}),
]
