import { GameState, PlayerState, GridCellType } from './game'
import { allCells, keyMap } from './utils'
import { CardsLookupApi, CardType, CardCategory } from './cards'

export enum CompetitionType {
	Landlord = 1,
	Banker,
	Scientist,
	Thermalist,
	Miner
}

export interface Competition {
	type: CompetitionType
	title: string
	description: string
	getScore: (game: GameState, player: PlayerState) => number
}

const competition = (c: Competition) => c

const CompetitionsList = [
	competition({
		type: CompetitionType.Landlord,
		title: 'Landlord',
		description: 'Most owned tiles on the map',
		getScore: (game, player) =>
			allCells(game).filter(
				c => c.ownerId === player.id && c.type !== GridCellType.Ocean
			).length
	}),
	competition({
		type: CompetitionType.Banker,
		title: 'Banker',
		description: 'Biggest money income (without TR)',
		getScore: (_game, player) => player.moneyProduction
	}),
	competition({
		type: CompetitionType.Scientist,
		title: 'Scientist',
		description: "Most science cards on the table (Events don't count)",
		getScore: (_game, player) =>
			player.usedCards
				.map(c => CardsLookupApi.get(c.code))
				.reduce(
					(acc, c) =>
						acc +
						((c.type !== CardType.Event &&
							c.categories.filter(c => c === CardCategory.Science).length) ||
							0),
					0
				)
	}),
	competition({
		type: CompetitionType.Thermalist,
		title: 'Thermalist',
		description: 'Most accumulated heat',
		getScore: (_game, player) => player.heat
	}),
	competition({
		type: CompetitionType.Miner,
		title: 'Miner',
		description: 'Most accumulated ore and titan combined',
		getScore: (_game, player) => player.ore + player.titan
	})
]

export const Competitions = keyMap(CompetitionsList, 'type')
