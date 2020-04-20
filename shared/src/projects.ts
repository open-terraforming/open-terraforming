import { WithOptional, Resource } from './cards'
import {
	GameState,
	GridCellContent,
	PlayerState,
	StandardProjectType
} from './game'
import { allCells, keyMap, pushPendingAction } from './utils'
import { canPlace } from './placements'
import { updatePlayerProduction, updatePlayerResource } from './cards/utils'
import { placeTileAction } from './player-actions'

export interface StandardProjectContext {
	player: PlayerState
	game: GameState
}

export interface StandardProject {
	type: StandardProjectType
	description: string
	cost: (ctx: StandardProjectContext) => number
	resource: Resource
	conditions: ((ctx: StandardProjectContext) => boolean)[]
	execute: (ctx: StandardProjectContext, cards: number[]) => void
}

const project = (
	s: WithOptional<StandardProject, 'conditions' | 'resource'>
): StandardProject => ({
	resource: 'money',
	...s,
	conditions: [
		...(s.conditions || []),
		(ctx: StandardProjectContext) =>
			ctx.player[s.resource ?? 'money'] >= s.cost(ctx)
	]
})

const canPlaceTile = (type: GridCellContent) => ({
	game,
	player
}: StandardProjectContext) =>
	!!allCells(game).find(c =>
		canPlace(game, player, c, {
			type
		})
	)

const ProjectsList = [
	project({
		type: StandardProjectType.SellPatents,
		description: 'Sell patents',
		cost: () => 0,
		conditions: [({ player }) => player.cards.length > 0],
		execute: ({ player }, cards) => {
			if (new Set(cards).size !== cards.length) {
				throw new Error('Only unique cards please')
			}

			if (!cards.every(c => c >= 0 && c < player.cards.length)) {
				throw new Error('Some card indexes are off!')
			}

			player.cards = player.cards.filter((_c, i) => !cards.includes(i))
			updatePlayerResource(player, 'money', cards.length)
		}
	}),
	project({
		type: StandardProjectType.PowerPlant,
		description: 'Power plant',
		cost: ({ player }) => player.powerProjectCost,
		execute: ({ player }) => {
			updatePlayerProduction(player, 'energy', 1)
		}
	}),
	project({
		type: StandardProjectType.Asteroid,
		description: 'Asteroid',
		cost: () => 14,
		conditions: [({ game }) => game.temperature < game.map.temperature],
		execute: ({ game, player }) => {
			player.terraformRating += 1
			game.temperature += 1
		}
	}),
	project({
		type: StandardProjectType.Aquifer,
		description: 'Aquifer',
		cost: () => 18,
		conditions: [({ game }) => game.oceans < game.map.oceans],
		execute: ({ player }) => {
			pushPendingAction(
				player,
				placeTileAction({
					type: GridCellContent.Ocean
				})
			)
		}
	}),
	project({
		type: StandardProjectType.Greenery,
		description: 'Greenery',
		cost: () => 23,
		conditions: [canPlaceTile(GridCellContent.Forest)],
		execute: ({ player }) => {
			pushPendingAction(
				player,
				placeTileAction({
					type: GridCellContent.Forest
				})
			)
		}
	}),
	project({
		type: StandardProjectType.City,
		description: 'City',
		cost: () => 25,
		conditions: [canPlaceTile(GridCellContent.City)],
		execute: ({ player }) => {
			updatePlayerProduction(player, 'money', 1)
			pushPendingAction(
				player,
				placeTileAction({
					type: GridCellContent.City
				})
			)
		}
	}),
	project({
		type: StandardProjectType.GreeneryForPlants,
		description: 'Greenery bought using 8 pants',
		cost: ({ player }) => player.greeneryCost,
		resource: 'plants',
		conditions: [canPlaceTile(GridCellContent.Forest)],
		execute: ({ player }) => {
			pushPendingAction(
				player,
				placeTileAction({
					type: GridCellContent.Forest
				})
			)
		}
	}),
	project({
		type: StandardProjectType.TemperatureForHeat,
		description: 'Temperature increase using 8 heat',
		cost: () => 8,
		resource: 'heat',
		conditions: [({ game }) => game.temperature < game.map.temperature],
		execute: ({ game, player }) => {
			player.terraformRating += 1
			game.temperature += 1
		}
	})
]

export const Projects = keyMap(ProjectsList, 'type')
