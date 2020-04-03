import { WithOptional } from './cards'
import {
	GameState,
	GridCellContent,
	PlayerState,
	StandardProjectType,
} from './game'
import { allCells, keyMap } from './utils'
import { canPlace } from './placements'

export interface StandardProjectContext {
	player: PlayerState
	game: GameState
}

export interface StandardProject {
	type: StandardProjectType
	description: string
	cost: number
	conditions: ((ctx: StandardProjectContext) => boolean)[]
	execute: (ctx: StandardProjectContext, cards: number[]) => void
}

const project = (
	s: WithOptional<StandardProject, 'conditions'>
): StandardProject => ({
	...s,
	conditions: [
		...(s.conditions || []),
		...(s.cost > 0
			? [
					({ player }: StandardProjectContext) =>
						player.gameState.money >= s.cost,
			  ]
			: []),
	],
})

const canPlaceTile = (type: GridCellContent) => ({
	game,
	player,
}: StandardProjectContext) =>
	!!allCells(game).find((c) =>
		canPlace(game, player, c, {
			type,
		})
	)

const ProjectsList = [
	project({
		type: StandardProjectType.SellPatents,
		description: 'Sell patents',
		cost: 0,
		conditions: [({ player }) => player.gameState.cards.length > 0],
		execute: ({ player: { gameState: player } }, cards) => {
			if (new Set(cards).size !== cards.length) {
				throw new Error('Only unique cards please')
			}

			if (!cards.every((c) => c >= 0 && c < player.cards.length)) {
				throw new Error('Some card indexes are off!')
			}

			player.cards = player.cards.filter((_c, i) => !cards.includes(i))
			player.money += cards.length
		},
	}),
	project({
		type: StandardProjectType.PowerPlant,
		description: 'Power plant',
		cost: 11,
		execute: ({ player: { gameState: player } }) => {
			player.money -= 11
			player.energyProduction += 1
		},
	}),
	project({
		type: StandardProjectType.Asteroid,
		description: 'Asteroid',
		cost: 14,
		conditions: [({ game }) => game.temperature < game.map.temperature],
		execute: ({ game, player: { gameState: player } }) => {
			player.money -= 14
			player.terraformRating += 1
			game.temperature += 1
		},
	}),
	project({
		type: StandardProjectType.Aquifer,
		description: 'Aquifer',
		cost: 18,
		conditions: [({ game }) => game.oceans < game.map.oceans],
		execute: ({ player: { gameState: player } }) => {
			player.money -= 18
			player.placingTile.push({
				type: GridCellContent.Ocean,
			})
		},
	}),
	project({
		type: StandardProjectType.Greenery,
		description: 'Greenery',
		cost: 23,
		conditions: [canPlaceTile(GridCellContent.Forest)],
		execute: ({ player: { gameState: player } }) => {
			player.money -= 23
			player.placingTile.push({
				type: GridCellContent.Forest,
			})
		},
	}),
	project({
		type: StandardProjectType.City,
		description: 'City',
		cost: 25,
		conditions: [canPlaceTile(GridCellContent.City)],
		execute: ({ player: { gameState: player } }) => {
			player.money -= 25
			player.moneyProduction += 1
			player.placingTile.push({
				type: GridCellContent.City,
			})
		},
	}),
	project({
		type: StandardProjectType.GreeneryForPlants,
		description: 'Greenery bought using 8 pants',
		cost: 0,
		conditions: [
			canPlaceTile(GridCellContent.Forest),
			({ player }) => player.gameState.plants >= 8,
		],
		execute: ({ player: { gameState: player } }) => {
			player.plants -= 8
			player.placingTile.push({
				type: GridCellContent.Forest,
			})
		},
	}),
	project({
		type: StandardProjectType.TemperatureForHeat,
		description: 'Temperature increase using 8 heat',
		cost: 0,
		conditions: [
			({ game }) => game.temperature < game.map.temperature,
			({ player }) => player.gameState.heat >= 8,
		],
		execute: ({ game, player: { gameState: player } }) => {
			player.heat -= 8
			player.terraformRating += 1
			game.temperature += 1
		},
	}),
]

export const Projects = keyMap(ProjectsList, 'type')
