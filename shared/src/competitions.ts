import { CardCategory, CardsLookupApi, CardType } from './cards'
import { GameState, GridCellType, PlayerState, GridCellContent } from './game'
import { allCells, allTiles, keyMap } from './utils'

export enum CompetitionType {
	Landlord = 1,
	Banker,
	Scientist,
	Thermalist,
	Miner,
	Cultivator,
	Magnate,
	SpaceBaron,
	Eccentric,
	Contractor,
	Celebrity,
	Industrialist,
	DesertSettler,
	EstateDealer,
	Benefactor
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
				c => c.ownerId === player.id && c.content !== GridCellContent.Ocean
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
	}),
	competition({
		type: CompetitionType.Cultivator,
		title: 'Cultivator',
		description: 'Most greenery tiles',
		getScore: (game, player) =>
			allTiles(game)
				.ownedBy(player.id)
				.hasGreenery().length
	}),
	competition({
		type: CompetitionType.Magnate,
		title: 'Magnate',
		description: 'Most automated (green cards) in play',
		getScore: (_game, player) =>
			player.usedCards.filter(
				c => CardsLookupApi.get(c.code).type === CardType.Building
			).length
	}),
	competition({
		type: CompetitionType.SpaceBaron,
		title: 'Space Baron',
		description: 'Most non-event space tags in play',
		getScore: (_game, player) =>
			player.usedCards
				.map(c => CardsLookupApi.get(c.code))
				.filter(
					c =>
						c.type !== CardType.Event &&
						c.categories.includes(CardCategory.Space)
				).length
	}),
	competition({
		type: CompetitionType.Eccentric,
		title: 'Eccentric',
		description: 'Most resources on cards',
		getScore: (_game, player) =>
			player.usedCards
				.map(c => ({ resource: CardsLookupApi.get(c.code).resource, state: c }))
				.reduce(
					(acc, { resource, state }) =>
						acc + (resource !== undefined ? state[resource] : 0),
					0
				)
	}),
	competition({
		type: CompetitionType.Contractor,
		title: 'Contractor',
		description: 'Most non-event building tags',
		getScore: (_game, player) =>
			player.usedCards
				.map(c => CardsLookupApi.get(c.code))
				.filter(
					c =>
						c.type !== CardType.Event &&
						c.categories.includes(CardCategory.Building)
				).length
	}),
	competition({
		type: CompetitionType.Celebrity,
		title: 'Celebrity',
		description:
			'Most cards (excluding events) in play with cost of at least 20',
		getScore: (_game, player) =>
			player.usedCards
				.map(c => CardsLookupApi.get(c.code))
				.filter(c => c.type !== CardType.Event && c.cost >= 20).length
	}),
	competition({
		type: CompetitionType.Industrialist,
		title: 'Industrialist',
		description: 'Most ore and energy resources',
		getScore: (_game, player) => player.ore + player.energy
	}),
	competition({
		type: CompetitionType.DesertSettler,
		title: 'Desert Settler',
		description: 'Most tiles south of equator (bottom 4 rows)',
		getScore: (game, player) =>
			allTiles(game)
				.ownedBy(player.id)
				.onMars()
				.c(c => c.content !== undefined && c.y >= game.map.height - 4).length
	}),
	competition({
		type: CompetitionType.EstateDealer,
		title: 'Estate Dealer',
		description: 'Most tiles adjacent to ocean tiles',
		getScore: (game, player) =>
			allTiles(game)
				.ownedBy(player.id)
				.nextTo(game, GridCellContent.Ocean).length
	}),
	competition({
		type: CompetitionType.Benefactor,
		title: 'Benefactor',
		description: 'Highest terraforming rating',
		getScore: (_game, player) => player.terraformRating
	})
]

export const Competitions = keyMap(CompetitionsList, 'type')
