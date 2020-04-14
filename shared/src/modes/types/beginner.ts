import { CardsLookupApi, CardSpecial } from '../../cards'
import { GameModeType } from '../types'
import { gameMode, prepareCorporations } from '../utils'

export const BeginnerMode = gameMode({
	type: GameModeType.Beginner,
	name: 'Beginner mode',
	description:
		'Starting corporation is available, everybody starts with 1 production of every resource and the cards selection is limited.',
	onGameStart: game => {
		const startingCorp = game.corporations
			.map(c => CardsLookupApi.get(c))
			.find(c => c.special.includes(CardSpecial.StartingCorporation))

		if (!startingCorp) {
			throw new Error('Failed to find starting corporation')
		}

		prepareCorporations(game)

		game.players.forEach(p => {
			p.moneyProduction = 1
			p.oreProduction = 1
			p.plantsProduction = 1
			p.energyProduction = 1
			p.titanProduction = 1
			p.heatProduction = 1
			p.cardsPick.push(startingCorp.code)
		})
	},
	filterCards: cards =>
		cards.filter(c => !c.special.includes(CardSpecial.CorporationsEra))
})
