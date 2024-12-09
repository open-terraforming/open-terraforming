import { CardCategory } from '@shared/cards'

export type AiScoringCoefficients = ReturnType<
	typeof defaultScoringCoefficients
>

export const defaultScoringCoefficients = () => ({
	starting: {
		maxCardsCost: 0.5,
	},

	generationStart: {
		maxCardsCost: 0.3,
	},

	terraformingRating: 7,
	victoryPoints: 6,
	titanPrice: 3,
	orePrice: 2,
	cardPriceChange: 1,
	cardPriceChangePerTag: 1,
	cardCount: 0.3,
	playableCardsScore: 0.05,
	playableCardsCountScore: 0.02,

	usedCards: {
		victoryPoints: 5,
		uniqueTags: 0.2,
		action: 1,
		passiveEffect: 1,
		resourceAsMoney: 1,
		tags: {
			[CardCategory.Science]: 0.25,
			[CardCategory.Space]: 0.25,
			[CardCategory.Building]: 0.25,
			[CardCategory.Microbe]: 0.1,
			[CardCategory.Animal]: 0.1,
			[CardCategory.Plant]: 0.25,
			[CardCategory.Jupiter]: 0.25,
			[CardCategory.Power]: 0.1,
			[CardCategory.Earth]: 0.25,
			[CardCategory.City]: 0,
			[CardCategory.Event]: 0,
			[CardCategory.Venus]: 0.25,
			[CardCategory.Any]: 0.5,
		},
	},

	tileVictoryPoints: 5,
	freeFleetsCount: 1,
	coloniesCount: 1,

	resources: {
		money: 0.6,
		ore: 0.7,
		titan: 0.8,
		plants: 1,
		heatWhenBelowGlobalTemperature: 0.75,
		heatWhenAboveGlobalTemperature: 0,
		energyWhenBelowGlobalTemperature: 0.8,
		energyWhenAboveGlobalTemperature: 0.2,
	},

	production: {
		money: 1.25,
		ore: 1,
		titan: 1.1,
		plants: 1.4,
		heatWhenBelowGlobalTemperature: 1.4,
		heatWhenAboveGlobalTemperature: 0,
		energyWhenBelowGlobalTemperature: 1.2,
		energyWhenAboveGlobalTemperature: 0.4,
	},

	pendingActions: {
		pickCards: {
			whenFreeLimitCount: 1,
			whenNotFree: 0.5,
		},
		buildColony: {
			whenMoreColoniesPerColony: 1.5,
			whenLimited: 1,
		},
		claimTile: 0.1,
		placeTile: 1,
		addCardResource: 0.5,
		changeColonyStep: 1,
		tradeWithColony: 2,
		sponsorCompetition: 0.2,
		playCard: 1,
		draftCard: 0.5,
	},

	committee: {
		delegatesCount: 0.2,
		leaderOfDominantParty: 1,
		leaderOfParty: 0.3,

		lastGeneration: {
			leaderOfParty: 1,
		},
	},

	globalEvents: {
		influence: 0.5,
	},
})
