import { CardCategory, CardType } from '@shared/cards'
import {
	cardCategoryCountCondition,
	cardResourceCondition,
	cellTypeCondition,
} from '@shared/cards/conditions'
import {
	cardResourceChange,
	effectChoice,
	joinedEffects,
	otherCardResourceChange,
	placeOcean,
	playerResourceChange,
	productionChange,
	productionChangeForTags,
	productionForPlayersTags,
	resourceChange,
	resourcesForTiles,
	terraformRatingChange,
} from '@shared/cards/effects'
import { colonyTradePriceChange } from '@shared/cards/effects/colonyTradePriceChange'
import { productionChangePerCardResource } from '@shared/cards/effects/productionChangePerCardResource'
import { productionChangePerColony } from '@shared/cards/effects/productionChangePerColony'
import { productionChangePerNoTags } from '@shared/cards/effects/productionChangePerNoTags'
import { resourcePerCardResource } from '@shared/cards/effects/resourcePerCardResource'
import { resourcesForColonies } from '@shared/cards/effects/resourcesForColonies'
import {
	cardResourcePerSelfTagPlayed,
	resetCardPriceChange,
} from '@shared/cards/passive-effects'
import { card, withRightArrow } from '@shared/cards/utils'
import { vpsForCardResources } from '@shared/cards/vps'
import { GridCellContent } from '@shared/game'

export const colonyCards = [
	card({
		code: 'airliners',
		cost: 11,
		type: CardType.Building,
		categories: [],
		conditions: [cardResourceCondition('floaters', 3)],
		playEffects: [
			productionChange('money', 2),
			otherCardResourceChange('microbes', 2),
		],
		victoryPoints: 1,
	}),
	card({
		code: 'air-raid',
		cost: 0,
		type: CardType.Action,
		categories: [CardCategory.Event],
		playEffects: [
			// TODO: Is this required?
			otherCardResourceChange('microbes', -1),
			playerResourceChange('money', -5),
			resourceChange('money', 5),
		],
	}),
	card({
		code: 'atmo-collectors',
		cost: 15,
		type: CardType.Building,
		categories: [],
		resource: 'floaters',
		playEffects: [otherCardResourceChange('floaters', 2)],
		actionEffects: [
			effectChoice([
				cardResourceChange('floaters', 1),
				joinedEffects([
					cardResourceChange('floaters', -1),
					effectChoice([
						resourceChange('titan', 2),
						resourceChange('energy', 3),
						resourceChange('heat', 4),
					]),
				]),
			]),
		],
	}),
	card({
		code: 'community-services',
		cost: 13,
		type: CardType.Building,
		categories: [],
		playEffects: [productionChangePerNoTags('money', 1)],
		victoryPoints: 1,
	}),
	card({
		code: 'conscription',
		cost: 5,
		type: CardType.Event,
		categories: [CardCategory.Earth, CardCategory.Event],
		conditions: [cardCategoryCountCondition(CardCategory.Earth, 2)],
		passiveEffects: [resetCardPriceChange(-16)],
	}),
	card({
		code: 'corona-extractor',
		cost: 10,
		type: CardType.Building,
		categories: [CardCategory.Power, CardCategory.Space],
		conditions: [cardCategoryCountCondition(CardCategory.Science, 4)],
		playEffects: [productionChange('energy', 4)],
	}),
	card({
		code: 'cryo-sleep',
		cost: 10,
		type: CardType.Action,
		categories: [CardCategory.Science],
		playEffects: [colonyTradePriceChange(-1)],
		victoryPoints: 1,
	}),
	card({
		code: 'earth-elevator',
		cost: 43,
		type: CardType.Building,
		categories: [CardCategory.Earth, CardCategory.Space],
		playEffects: [productionChange('titan', 3)],
		victoryPoints: 4,
	}),
	card({
		code: 'ecology-research',
		cost: 21,
		type: CardType.Building,
		categories: [
			CardCategory.Science,
			CardCategory.Animal,
			CardCategory.Microbe,
			CardCategory.Plant,
		],
		playEffects: [
			productionChangePerColony('plants', 1),
			otherCardResourceChange('animals', 1),
			otherCardResourceChange('microbes', 2),
		],
	}),
	card({
		code: 'floater-leasing',
		cost: 3,
		type: CardType.Building,
		categories: [],
		playEffects: [productionChangePerCardResource('money', 'floaters', 3)],
	}),
	card({
		code: 'floater-prototypes',
		cost: 2,
		type: CardType.Event,
		categories: [CardCategory.Science, CardCategory.Event],
		playEffects: [otherCardResourceChange('floaters', 2)],
	}),
	card({
		code: 'floater-technology',
		cost: 7,
		type: CardType.Action,
		categories: [CardCategory.Science],
		actionEffects: [cardResourceChange('floaters', 1)],
	}),
	card({
		code: 'galilean-waystation',
		cost: 15,
		type: CardType.Building,
		categories: [CardCategory.Space],
		playEffects: [
			productionForPlayersTags(CardCategory.Jupiter, 'money', 1, true),
		],
		victoryPoints: 1,
	}),
	card({
		code: 'heavy-taxation',
		cost: 3,
		type: CardType.Building,
		categories: [CardCategory.Earth],
		conditions: [cardCategoryCountCondition(CardCategory.Earth, 2)],
		playEffects: [productionChange('money', 2), resourceChange('money', 4)],
		victoryPoints: -1,
	}),
	card({
		code: 'ice-moon-colony',
		cost: 23,
		type: CardType.Building,
		categories: [CardCategory.Space],
		playEffects: [
			placeOcean(),
			// TODO:
			// placeColony(),
		],
	}),
	card({
		code: 'impactor-swarm',
		cost: 11,
		type: CardType.Event,
		categories: [CardCategory.Space, CardCategory.Event],
		conditions: [cardCategoryCountCondition(CardCategory.Jupiter, 2)],
		playEffects: [
			resourceChange('heat', 12),
			playerResourceChange('plants', -2, true),
		],
	}),
	card({
		code: 'interplanetary-colony-ship',
		cost: 12,
		type: CardType.Event,
		categories: [CardCategory.Earth, CardCategory.Space, CardCategory.Event],
		playEffects: [
			// TODO: placeColony(),
		],
	}),
	card({
		code: 'jovian-lanterns',
		cost: 20,
		type: CardType.Action,
		categories: [CardCategory.Jupiter],
		conditions: [cardCategoryCountCondition(CardCategory.Jupiter, 1)],
		resource: 'floaters',
		victoryPointsCallback: vpsForCardResources('floaters', 2),
		playEffects: [
			terraformRatingChange(1),
			otherCardResourceChange('floaters', 2),
		],
		actionEffects: [
			withRightArrow(resourceChange('titan', -1)),
			cardResourceChange('floaters', 2),
		],
	}),
	card({
		code: 'jupiter-floating-station',
		cost: 9,
		type: CardType.Action,
		categories: [CardCategory.Jupiter],
		conditions: [cardCategoryCountCondition(CardCategory.Science, 3)],
		resource: 'floaters',
		actionEffects: [
			effectChoice([
				otherCardResourceChange('floaters', 1, CardCategory.Jupiter),
				resourcePerCardResource('money', 1, 'floaters', 4),
			]),
		],
	}),
	card({
		code: 'luna-governor',
		cost: 4,
		type: CardType.Building,
		categories: [CardCategory.Earth, CardCategory.Earth],
		conditions: [cardCategoryCountCondition(CardCategory.Earth, 3)],
		playEffects: [productionChange('money', 2)],
	}),
	card({
		code: 'lunar-exports',
		cost: 19,
		type: CardType.Building,
		categories: [CardCategory.Space, CardCategory.Earth],
		playEffects: [
			effectChoice([
				productionChange('plants', 2),
				productionChange('money', 5),
			]),
		],
	}),
	card({
		code: 'lunar-mining',
		cost: 11,
		type: CardType.Building,
		categories: [CardCategory.Earth],
		playEffects: [productionChangeForTags('titan', 1, CardCategory.Earth, 2)],
	}),
	card({
		code: 'market-manipulation',
		cost: 1,
		type: CardType.Event,
		categories: [CardCategory.Earth, CardCategory.Event],
		playEffects: [
			// TODO:
			// changeColonyIncomeStep(1),
			// changeColonyIncomeStep(-1)
		],
	}),
	card({
		code: 'martian-zoo',
		cost: 12,
		type: CardType.Action,
		categories: [CardCategory.Animal, CardCategory.Building],
		conditions: [cellTypeCondition(GridCellContent.City, 2)],
		passiveEffects: [
			cardResourcePerSelfTagPlayed(CardCategory.Earth, 'animals', 1),
		],
		playEffects: [resourcePerCardResource('money', 1, 'animals')],
		victoryPoints: 1,
	}),
	card({
		code: 'mining-colony',
		cost: 20,
		type: CardType.Building,
		categories: [CardCategory.Space],
		playEffects: [
			productionChange('titan', 1),
			// TODO: placeColony()
		],
	}),
	card({
		code: 'minority-refuge',
		cost: 5,
		type: CardType.Building,
		categories: [CardCategory.Space],
		playEffects: [
			productionChange('money', -2),
			// TODO: placeColony()
		],
	}),
	card({
		code: 'molecular-printing',
		cost: 11,
		type: CardType.Building,
		categories: [CardCategory.Science],
		playEffects: [
			resourcesForTiles(GridCellContent.City, 'money', 1, false),
			resourcesForColonies('money', 1),
		],
	}),
]

/*

    Air Raid
    0
    #C02
    STEAL 5
    (Requires that you lose 1 floater. Steal 5 MC from any player.)
    Atmo Collectors
    15
    #C03
           OR
    2
    /3
    /4
    (Action: Add 1 floater here, or spend 1 floater here to gain 2 titanium, or 3 energy, or 4 heat.)
    *
    (Add 2 floaters to ANY card.)
    Community Services
    13
    #C04
    1
    1
    / X
    *
    (Increase your MC production 1 step per CARD WITH NO TAGS, including this.)
    Conscription
    5
    #C05
    -1
    Earth Earth
    NEXT CARD: -16
    (Requires 2 Earth tags. The next card you play this generation costs 16 MC less.)
    Corona Extractor
    10
    #C06
    4 Science
    4
    (Requires 4 science tags. Increase your energy production 4 steps.)
    Cryo Sleep
    10
    #C07
    1
    : -1
    (Effect: When you trade, you pay 1 less resource for it.)
    Earth Elevator
    43
    #C08
    4
    (Increase your titanium production 3 steps.)
    Ecology Research
    21
    #C09
    1
    /

    *
    *
    (Increase your plant production 1 step for each colony you own. Add 1 animal to ANOTHER card and 2 microbes to ANOTHER card.)
    Floater Leasing
    3
    #C10
    1
     / 3
    (Increase your MC production 1 step per 3 floaters you have.)
    Floater Prototypes
    2
    #C11
    *
    (Add two floaters to ANOTHER card.)
    Floater Technology
    7
    #C12
    *
    (Action: Add 1 floater to ANOTHER card.)
    Galilean Waystation
    15
    #C13
    1
    1
    /
    (Increase your MC production 1 step for every Jovian tag in play.)
    Heavy Taxation
    3
    #C14
    -1
    Earth Earth
    2
    4
    (Requires 2 Earth tags. Increase your MC production 2 steps, and gain 4MC.)
    Ice Moon Colony
    23
    #C15
    (Place 1 colony and 1 ocean tile.)
    Impactor Swarm
    11
    #C16
    Jovian Jovian
    12

    (Requires 2 Jovian tags. Gain 12 heat. Remove up to 2 plants from any player.)
    Interplanetary Colony Ship
    12
    #C17



    (Place a colony.)
    Jovian Lanterns
    20
    #C18
    1/2
    Jovian
    (Action: Spend 1 titanium to add 2 floaters here.)
    *
    (Requires 1 Jovian tag. Increase your TR 1 step. Add 2 floaters to ANY
    card. 1VP per 2 floaters.)
    Jupiter Floating Station
    9
    #C19
    1
    3 Science
    OR
    1
    /
    * (max 4)
    (Action: Add 1 floater to a JOVIAN CARD, or gain 1 MC for every floater here (MAX 4).)

    (Requires 3 Science tags.)
    Luna Governor
    4
    #C20
    Earth Earth Earth
    2
    (Requires 3 Earth tags. Increase your MC production 2 steps.)
    Lunar Exports
    19
    #C21
    OR 5
    (Increase your plant production 2 steps, or your MC production 5 steps.)
    Lunar Mining
    11
    #C22
    / 2
    (Increase your titanium production 1 step for every 2 Earth tags you have in play, including this.)
    Market Manipulation
    1
    #C23
    INCREASE ONE COLONY TILE TRACK 1 STEP.
    DECREASE ANOTHER COLONY TILE TRACK 1 STEP.
    Martian Zoo
    12
    #C24
    1
    2 Cities
    :

    1
    /
    (Effect: When you play an Earth tag, place an animal here.)

    (Action: Gain 1MC per animal here.)

    (Requires 2 city
    tiles in play.)
    Mining Colony
    20
    #C25
    (Increase your titanium production 1 step. Place a colony.)
    Minority Refuge
    5
    #C26
    -2
    (Decrease your MC production 2 steps. Place a colony.)
    Molecular Printing
    11
    #C27
    1
    1
    /

    1
    /
    (Gain 1Mc for each city tile in play.
    Gain 1MC for each colony in play.)
    Nitrogen From Titan
    25
    #C28
    1
    (Raise your TR 2 steps. Add 2 floaters to a JOVIAN CARD.)
    Pioneer Settlement
    13
    #C29
    2
    max 1 Colony
    -2
    (Requires that you have no more than 1 colony. Decrease your MC production 2 steps. Place a colony.)
    Productive Outpost
    0
    #C30
    GAIN ALL YOUR COLONY BONUSES
    Quantum Communications
    8
    #C31
    1
    4 Science
    1
    /

    (Requires 4 Science tags. Increase your MC production 1 step for each colony in play.)
    Red Spot Observatory
    17
    #C32
    2
    3 Science
    OR
    (Action: Add 1 floater to this card, or spend 1 floater here to draw a card.)
    (Requires 3 Science tags.
      Draw 2 cards.)
    Refugee Camps
    10
    #C33
    1/
    1
    (Action: Decrease your MC production 1 step to add a camp resource to this card.)

    (1 VP for each camp resource on this card.)
    Research Colony
    20
    #C34
    *
    (Place a colony. MAY BE PLACED WHERE YOU ALREADY HAVE A COLONY. Draw 2 cards.)
    Rim Freighters
    4
    #C35
    : -1
    (Effect: When you trade, you pay 1 less resource for it.)
    Sky Docks
    18
    #C36
    2
    Earth Earth
    : -1
    (Effect: When you play a card, you pay 1 MC less for it.)
    (Requires 2 Earth tags. Gain 1 Trade Fleet.)
    Solar Probe
    9
    #C37
    1
    /
    (Draw 1 card for every 3 science tags you have, including this.)
    Solar Reflectors
    23
    #C38
    5
    (Increase your heat production 5 steps.)
    Space Port
    22
    #C39
    Colony
    4

    (Requires 1 colony. Decrease your Energy production 1 step and increase your MC production 4 steps. Place a City tile. Gain 1 Trade Fleet.)
    Space Port Colony
    27
    #C40
    1/2
    Colony
    *

    (Requires a colony. Place a colony.
    MAY BE PLACED ON A COLONY TILE WHERE YOU ALREADY HAVE A COLONY.
    Gain 1 Trade Fleet. 1VP per 2 colonies in play.)
    Spin-off Department
    10
    #C41
    20
    * :
    (Effect: WHEN PLAYING A CARD WITH A BASIC COST OF 20MC OR MORE, draw a card.)

    2
    (Increase your MC production 2 steps.)
    Sub-Zero Salt Fish
    5
    #C42
    1/2
    -6 C
    (Action: Add 1 Animal to this card.)
    (Requires -6 C. Decrease any Plant production 1 step. 1 VP per
    2 Animals on this card.)
    Titan Air-scrapping
    21
    #C43
    2

    OR
    (Action: Spend 1 titanium to add 2 floaters here, or spend 2 floaters here to increase your TR 1 step.)
    Titan Floating Launch-Pad
    18
    #C44
    1

    OR
    (Action: Add 1 floater to ANY JOVIAN CARD, or spend 1 floater here to trade for free.)
    (Add two floaters to ANY JOVIAN CARD.)
    Titan Shuttles
    23
    #C45
    1

    OR X
    X
    (Action: Add 2 floaters to ANY JOVIAN CARD, or spend any number of floaters here to gain the same number of titanium.)
    Trade Envoys
    6
    #C46
    : +1
    (Effect: When you trade, you may first increase that Colony Tile track 1 step.)
    Trading Colony
    18
    #C47
    : +1
    (Effect: When you trade, you may first increase that Colony Tile track 1 step.)

    (Place a colony.)
    Urban Decomposers
    6
    #C48
    Colony City
    *
    (Requires that you have 1 city tile and 1 colony in play. Increase your plant production 1 step, and add 2 microbes to ANOTHER card.)
    Warp Drive
    14
    #C49
    2
		*/
