import { initialStandardProjectState } from '@shared/states'
import { CardsLookupApi, CardSpecial } from '../cards'
import { CompetitionType } from '../competitions'
import { venusExtraCells } from '../extraCells/venusExtraCells'
import { StandardProjectType } from '../gameState'
import { cardAt, terraformingRatingAt } from '../maps/utils'
import { MilestoneType } from '../milestones'
import { expansion, ExpansionType } from './types'

export const venusExpansion = expansion({
	type: ExpansionType.Venus,
	name: 'Venus',

	initialize(game) {
		game.map.grid.push(venusExtraCells)
		game.map.venusMilestones = [cardAt(3), terraformingRatingAt(8)]
		game.map.venus = 15
		game.map.milestones.push(MilestoneType.Hoverlord)
		game.map.competitions.push(CompetitionType.Venuphile)

		game.standardProjects.push(
			initialStandardProjectState(StandardProjectType.AirScrapping),
		)
	},

	getCards: () =>
		Object.values(CardsLookupApi.data()).filter((c) =>
			c.special.includes(CardSpecial.Venus),
		),
})
