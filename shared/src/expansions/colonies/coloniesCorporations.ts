import {
	CardCategory,
	CardsLookupApi,
	CardSpecial,
	CardType,
	SymbolType,
} from '@shared/cards'
import {
	anyCardResourceChange,
	effectChoice,
	productionChange,
	resourceChange,
} from '@shared/cards/effects'
import { exchangeCardResourceForResource } from '@shared/cards/effects/exchangeCardResourceForResource'
import { placeColony } from '@shared/cards/effects/placeColony'
import {
	cardResourcePerSelfTagPlayed,
	passiveEffect,
} from '@shared/cards/passive-effects'
import { card, prependRightArrow } from '@shared/cards/utils'
import { vpsForCardResources } from '@shared/cards/vps'

export const coloniesCorporations = [
	card({
		code: 'aridor',
		type: CardType.Corporation,
		cost: 0,
		categories: [],
		playEffects: [resourceChange('money', 40), placeColony()],
		passiveEffects: [
			passiveEffect({
				description:
					'When you get a new type of tag in play (excluding event cards), increase your money production 1 step.',
				symbols: [
					{ tag: CardCategory.Any },
					{ symbol: SymbolType.Colon },
					{ resource: 'money', production: true, count: 1 },
				],
				onCardBought(ctx, playedCard, playedCardIndex, playedBy) {
					if (playedBy !== ctx.player) {
						return
					}

					if (playedCard.type === CardType.Event) {
						return
					}

					// Collect all tags from all cards except the last one
					const existingTags = ctx.player.usedCards
						.slice(0, -1)
						.reduce((tags, card) => {
							const info = CardsLookupApi.get(card.code)

							for (const tag of info.categories) {
								tags.add(tag)
							}

							return tags
						}, new Set<CardCategory>())

					// Increase production for each new tag
					for (const tag of playedCard.categories) {
						if (!existingTags.has(tag)) {
							ctx.player.moneyProduction += 1
						}
					}
				},
			}),
		],
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'arklight',
		type: CardType.Corporation,
		cost: 0,
		categories: [CardCategory.Animal],
		playEffects: [resourceChange('money', 45), productionChange('money', 2)],
		resource: 'animals',
		passiveEffects: [
			cardResourcePerSelfTagPlayed(
				[CardCategory.Animal, CardCategory.Plant],
				'animals',
				1,
			),
		],
		victoryPointsCallback: vpsForCardResources('animals', 1 / 2),
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'polyphemos',
		type: CardType.Corporation,
		cost: 0,
		categories: [],
		playEffects: [
			resourceChange('money', 50),
			productionChange('money', 5),
			resourceChange('titan', 5),
		],
		passiveEffects: [
			passiveEffect({
				description: 'Sponsoring a project costs $5 instead of $3',
				symbols: [
					{ symbol: SymbolType.Card },
					{ symbol: SymbolType.Colon },
					{ resource: 'money', count: 5 },
				],
				onPlay(ctx) {
					ctx.player.sponsorCost = 5
				},
			}),
		],
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'poseidon',
		type: CardType.Corporation,
		cost: 0,
		categories: [],
		playEffects: [resourceChange('money', 45), placeColony()],
		passiveEffects: [
			passiveEffect({
				description:
					'When any colony is placed, increase your money production 1 step.',
				symbols: [
					{ symbol: SymbolType.Colony, other: true },
					{ symbol: SymbolType.Colon },
					{ resource: 'money', production: true, count: 1 },
				],
				onColonyBuilt(ctx) {
					ctx.player.moneyProduction += 1
				},
			}),
		],
		special: [CardSpecial.Colonies],
	}),
	card({
		code: 'storm_craft',
		type: CardType.Corporation,
		cost: 0,
		categories: [],
		playEffects: [resourceChange('money', 45), productionChange('money', 2)],
		resource: 'floaters',
		actionEffects: [
			effectChoice([
				prependRightArrow(anyCardResourceChange('floaters', 1)),
				// TODO: The original is: You can use the floaters as 2 heat each for anything - so it's not limited to one action per turn - but that'd be so complicated to implement, I'm not sure it's worth it.
				exchangeCardResourceForResource('floaters', 'heat', 2),
			]),
		],
		special: [CardSpecial.Colonies],
	}),
]
