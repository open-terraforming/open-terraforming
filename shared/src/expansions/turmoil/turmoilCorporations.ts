import { Card, CardCategory, CardSpecial, CardType } from '@shared/cards'
import {
	productionChange,
	resourceChange,
	terraformRatingChange,
} from '@shared/cards/effectsGrouped'
import { productionPerPlacedTile } from '@shared/cards/passive-effects'
import { sponsorCostChange } from '@shared/cards/passive-effects/sponsorCostChange'
import { card } from '@shared/cards/utils'
import { vpsForCardResources } from '@shared/cards/vps'
import { GridCellContent } from '@shared/index'
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
			// TODO: Your bonus for placing adjacent to oceans is 3$ instead of 1$
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
			// TODO: During production, if you didn't increase your TR add preservation to this card and gain 6$
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
			// TODO: Decrease any production to gain 4 resources of that kind
		],
	}),
]
