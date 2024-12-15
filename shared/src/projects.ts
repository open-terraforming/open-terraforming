import { GameProgress, Resource, WithOptional } from './cards'
import {
	cellByCoords,
	updatePlayerProduction,
	updatePlayerResource,
} from './cards/utils'
import {
	GameState,
	GridCellContent,
	GridCellLocation,
	PlayerState,
	StandardProjectType,
} from './gameState'
import { canPlace, canPlaceAnywhere, PlacementState } from './placements'
import { applyTilePlace } from './utils/applyTilePlace'
import { keyMap } from './utils/keyMap'

export interface StandardProjectContext {
	player: PlayerState
	game: GameState
}

export enum StandardProjectArgumentType {
	Tile = 1,
	CardsInHand,
}

export interface StandardProjectTileArgValue {
	x: number
	y: number
	location: GridCellLocation | undefined
}

export type StandardProjectCardArgValue = number[]

export type StandardProjectArgValue =
	StandardProjectArgumentValueMap[StandardProjectArgumentType]

export type StandardProjectArgument =
	| ReturnType<typeof tileProjectArg>
	| typeof cardsProjectArg

export interface StandardProjectArgumentValueMap {
	[StandardProjectArgumentType.Tile]: StandardProjectTileArgValue
	[StandardProjectArgumentType.CardsInHand]: StandardProjectCardArgValue
}

type ExtractArguments<TArguments> = {
	[K in keyof TArguments]: TArguments[K] extends {
		type: infer T
	}
		? T extends keyof StandardProjectArgumentValueMap
			? StandardProjectArgumentValueMap[T]
			: never
		: never
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyStandardProject = StandardProject<any>

export interface StandardProject<TArgs extends StandardProjectArgument[] = []> {
	args?: TArgs
	type: StandardProjectType
	description: string
	cost: (ctx: StandardProjectContext) => number
	resource: Resource
	conditions: ((ctx: StandardProjectContext) => boolean)[]
	execute: (
		ctx: StandardProjectContext,
		...args: ExtractArguments<TArgs>
	) => void
}

const project = <TArgs extends StandardProjectArgument[] = []>(
	s: WithOptional<StandardProject<TArgs>, 'conditions' | 'resource'>,
): StandardProject<TArgs> => ({
	resource: 'money',
	...s,
	conditions: [
		...(s.conditions || []),
		(ctx: StandardProjectContext) =>
			ctx.player[s.resource ?? 'money'] >= s.cost(ctx),
	],
})

const canPlaceTile =
	(type: GridCellContent) =>
	({ game, player }: StandardProjectContext) =>
		canPlaceAnywhere(game, player, {
			type,
		})

const canIncreaseProgress =
	(process: GameProgress) =>
	({ game }: StandardProjectContext) => {
		return game[process] < game.map[process]
	}

const cardsProjectArg = {
	type: StandardProjectArgumentType.CardsInHand,
} as const

const tileProjectArg = (placement: PlacementState) =>
	({
		type: StandardProjectArgumentType.Tile,
		tilePlacement: placement,
	}) as const

const placeTileExecute =
	(
		placement: PlacementState,
	): StandardProject<
		[
			{
				type: StandardProjectArgumentType.Tile
				tilePlacement: PlacementState
			},
		]
	>['execute'] =>
	({ game, player }, position) => {
		if (
			typeof position !== 'object' ||
			typeof position.x !== 'number' ||
			typeof position.y !== 'number' ||
			(position.location !== undefined &&
				!(position.location in GridCellLocation))
		) {
			throw new Error('Invalid position ' + JSON.stringify(position))
		}

		const cell = cellByCoords(game, position.x, position.y, position.location)

		if (!cell) {
			throw new Error('Invalid cell')
		}

		if (!canPlace(game, player, cell, placement)) {
			throw new Error('Cannot place tile')
		}

		applyTilePlace({
			game,
			player,
			position,
			state: placement,
			anonymous: false,
		})
	}

const ProjectsList = [
	project({
		args: [cardsProjectArg],
		type: StandardProjectType.SellPatents,
		description: 'Sell patents',
		cost: () => 0,
		conditions: [({ player }) => player.cards.length > 0],
		execute: ({ player }, cards) => {
			if (new Set(cards).size !== cards.length) {
				throw new Error('Only unique cards please')
			}

			if (!cards.every((c) => c >= 0 && c < player.cards.length)) {
				throw new Error('Some card indexes are off!')
			}

			player.cards = player.cards.filter((_c, i) => !cards.includes(i))
			updatePlayerResource(player, 'money', cards.length)
		},
	}),
	project({
		type: StandardProjectType.PowerPlant,
		description: 'Power plant',
		cost: ({ player }) => player.powerProjectCost,
		execute: ({ player }) => {
			updatePlayerProduction(player, 'energy', 1)
		},
	}),
	project({
		type: StandardProjectType.Asteroid,
		description: 'Asteroid',
		cost: () => 14,
		conditions: [({ game }) => game.temperature < game.map.temperature],
		execute: ({ game, player }) => {
			player.terraformRating += 1
			player.terraformRatingIncreasedThisGeneration = true
			game.temperature += 1
		},
	}),
	project({
		args: [tileProjectArg({ type: GridCellContent.Ocean })],
		type: StandardProjectType.Aquifer,
		description: 'Aquifer',
		cost: () => 18,
		conditions: [({ game }) => game.oceans < game.map.oceans],
		execute: placeTileExecute({ type: GridCellContent.Ocean }),
	}),
	project({
		args: [tileProjectArg({ type: GridCellContent.Forest })],
		type: StandardProjectType.Greenery,
		description: 'Greenery',
		cost: () => 23,
		conditions: [canPlaceTile(GridCellContent.Forest)],
		execute: placeTileExecute({ type: GridCellContent.Forest }),
	}),
	project({
		args: [tileProjectArg({ type: GridCellContent.City })],
		type: StandardProjectType.City,
		description: 'City',
		cost: () => 25,
		conditions: [canPlaceTile(GridCellContent.City)],
		execute: placeTileExecute({ type: GridCellContent.City }),
	}),
	project({
		args: [tileProjectArg({ type: GridCellContent.Forest })],
		type: StandardProjectType.GreeneryForPlants,
		description: 'Greenery using plants',
		cost: ({ player }) => player.greeneryCost,
		resource: 'plants',
		conditions: [canPlaceTile(GridCellContent.Forest)],
		execute: placeTileExecute({ type: GridCellContent.Forest }),
	}),
	project({
		type: StandardProjectType.TemperatureForHeat,
		description: 'Temperature increase using heat',
		cost: () => 8,
		resource: 'heat',
		conditions: [({ game }) => game.temperature < game.map.temperature],
		execute: ({ game, player }) => {
			player.terraformRating += 1
			player.terraformRatingIncreasedThisGeneration = true
			game.temperature += 1
		},
	}),
	project({
		type: StandardProjectType.AirScrapping,
		description: 'Air Scrapping',
		cost: () => 15,
		conditions: [canIncreaseProgress('venus')],
		execute: ({ game, player }) => {
			player.terraformRating += 1
			player.terraformRatingIncreasedThisGeneration = true
			game.venus += 1
		},
	}),
]

export const Projects = keyMap(ProjectsList, 'type')
