import {
	CardCategory,
	CardsLookupApi,
	CardType,
	SymbolType,
} from '@shared/cards'
import {
	anyCardResourceChange,
	productionChange,
	resourceChange,
} from '@shared/cards/effects'
import { placeColony } from '@shared/cards/effects/placeColony'
import {
	cardResourcePerSelfTagPlayed,
	passiveEffect,
} from '@shared/cards/passive-effects'
import { card, withRightArrow } from '@shared/cards/utils'
import { vpsForCardResources } from '@shared/cards/vps'

export const colonyCorporations = [
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
					{ symbol: SymbolType.AnyTag },
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
			// TODO: Sponsoring projects costs $5 instead of $3 (including starting hand)
		],
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
					{ symbol: SymbolType.Colon, other: true },
					{ symbol: SymbolType.Colon },
					{ resource: 'money', production: true, count: 1 },
				],
				onColonyBuilt(ctx) {
					ctx.player.moneyProduction += 1
				},
			}),
		],
	}),
	card({
		code: 'storm_craft',
		type: CardType.Corporation,
		cost: 0,
		categories: [],
		playEffects: [resourceChange('money', 45), productionChange('money', 2)],
		resource: 'floaters',
		actionEffects: [withRightArrow(anyCardResourceChange('floaters', 1))],
		passiveEffects: [
			// TODO: Floaters on this card may be used as 2 heat each
		],
	}),
]
