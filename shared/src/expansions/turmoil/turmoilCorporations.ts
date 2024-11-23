import {
	Card,
	CardCategory,
	CardSpecial,
	CardType,
	Resource,
	SymbolType,
} from '@shared/cards'
import { resourceTypeArg } from '@shared/cards/args'
import { effect } from '@shared/cards/effects/types'
import {
	productionChange,
	resourceChange,
	terraformRatingChange,
} from '@shared/cards/effectsGrouped'
import {
	passiveEffect,
	productionPerPlacedTile,
} from '@shared/cards/passive-effects'
import { sponsorCostChange } from '@shared/cards/passive-effects/sponsorCostChange'
import { card, updatePlayerResource } from '@shared/cards/utils'
import { vpsForCardResources } from '@shared/cards/vps'
import { GridCellContent, PLAYER_RESOURCE_TO_PRODUCTION } from '@shared/index'
import { resourcePerPartyWithDelegate } from './cardEffects/resourcePerPartyWithDelegate'

export const turmoilCorporations: Card[] = [
	card({
		code: 'lakefront_resorts',
		type: CardType.Corporation,
		cost: 0,
		categories: [CardCategory.Building],
		special: [CardSpecial.Turmoil],
		playEffects: [resourceChange('money', 54)],
		passiveEffects: [
			productionPerPlacedTile(GridCellContent.Ocean, 'money', 1),
			passiveEffect({
				description:
					'Your bonus for placing next to oceans is 3$ instead of 2$',
				symbols: [
					{ tile: GridCellContent.Ocean },
					{ symbol: SymbolType.Colon },
					{ resource: 'money', count: 3 },
				],
				onPlay({ player }) {
					player.adjacentOceansBonus = 3
				},
			}),
		],
	}),
	card({
		code: 'pristar',
		type: CardType.Corporation,
		cost: 0,
		categories: [],
		special: [CardSpecial.Turmoil],
		resource: 'preservation',
		playEffects: [resourceChange('money', 53), terraformRatingChange(-2)],
		victoryPointsCallback: vpsForCardResources('preservation', 1),
		passiveEffects: [
			passiveEffect({
				description:
					"During production, if you didn't increase your TR, add preservation to this card and gain 6$",
				symbols: [
					{ text: 'NO', noRightSpacing: true },
					{ symbol: SymbolType.TerraformingRating },
					{ symbol: SymbolType.Colon },
					{ cardResource: 'preservation' },
				],
				onGenerationEnd({ player, card }) {
					if (!player.terraformRatingIncreasedThisGeneration) {
						card.preservation += 1
						updatePlayerResource(player, 'money', 6)
					}
				},
			}),
		],
	}),
	card({
		code: 'septem_tribus',
		type: CardType.Corporation,
		cost: 0,
		categories: [CardCategory.Any],
		special: [CardSpecial.Turmoil],
		playEffects: [resourceChange('money', 36)],
		actionEffects: [resourcePerPartyWithDelegate('money', 2)],
	}),
	card({
		code: 'terralabs_research',
		type: CardType.Corporation,
		cost: 0,
		categories: [CardCategory.Science, CardCategory.Earth],
		special: [CardSpecial.Turmoil],
		playEffects: [resourceChange('money', 14), terraformRatingChange(-1)],
		passiveEffects: [sponsorCostChange(1)],
	}),
	card({
		code: 'utopia_invest',
		type: CardType.Corporation,
		cost: 0,
		categories: [CardCategory.Building],
		special: [CardSpecial.Turmoil],
		playEffects: [
			resourceChange('money', 40),
			productionChange('ore', 1),
			productionChange('titan', 1),
		],
		actionEffects: [
			effect({
				description: 'Decrease any production to gain 4 resources of that kind',
				args: [
					{
						...resourceTypeArg([
							({ player }, resource) =>
								player[PLAYER_RESOURCE_TO_PRODUCTION[resource]] > 0,
						]),
						descriptionPrefix: 'Decrease',
					},
				],
				symbols: [
					{
						symbol: SymbolType.AnyProduction,
						count: -1,
						forceSign: true,
						forceCount: true,
					},
					{ symbol: SymbolType.RightArrow },
					{ symbol: SymbolType.AnyResource, count: 4 },
				],
				perform({ player }, resource) {
					if (
						typeof resource !== 'string' ||
						!(resource in PLAYER_RESOURCE_TO_PRODUCTION)
					) {
						throw new Error(
							'Invalid card arg resource - expected resource, got ' +
								JSON.stringify(resource),
						)
					}

					const production = PLAYER_RESOURCE_TO_PRODUCTION[resource as Resource]

					player[production] -= 1
					player[resource as Resource] += 4
				},
			}),
		],
	}),
]
