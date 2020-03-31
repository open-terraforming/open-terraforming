import {
	GridCell,
	GameState,
	GridCellType,
	PlayerGameState,
	GridCellContent,
	GridCellOther,
	GridCellSpecial,
	PlayerState,
} from './game'
import { adjacentCells } from './cards/utils'

const placement = (c: PlacementCondition) => c

export interface PlacementState {
	type: GridCellContent
	other?: GridCellOther
	ownerCard?: number
	special?: GridCellSpecial[]
	conditions?: PlacementCode[]
}

export enum PlacementCode {
	TitanOreBonus = 'titan_ore_bonus',
	OceanOnly = 'ocean_only',
	Isolated = 'isolated',
	NoOceans = 'no_oceans',
	NextToOwn = 'next_to_owned',
	TwoCities = 'two_cities',
	OneCity = 'one_city',
	OneForest = 'one_forest',
}

export interface PlacementContext {
	game: GameState
	player: PlayerGameState
	playerId: number
	cell: GridCell
}

export interface PlacementCondition {
	code: PlacementCode
	description: string
	evaluate: (ctx: PlacementContext) => boolean
}

export const PlacementConditions: Readonly<PlacementCondition[]> = [
	placement({
		code: PlacementCode.TitanOreBonus,
		description: 'area with ore or titan bonus',
		evaluate: ({ cell }) => cell.ore > 0 || cell.titan > 0,
	}),
	placement({
		code: PlacementCode.OceanOnly,
		description: 'ocean area',
		evaluate: ({ cell }) => cell.type === GridCellType.Ocean,
	}),
	placement({
		code: PlacementCode.NoOceans,
		description: '',
		evaluate: ({ cell }) => cell.type !== GridCellType.Ocean,
	}),
	placement({
		code: PlacementCode.Isolated,
		description: 'isolated area',
		evaluate: ({ cell, game }) =>
			adjacentCells(game, cell.x, cell.y).every((c) => !c.content),
	}),
	placement({
		code: PlacementCode.NextToOwn,
		description: '',
		evaluate: ({ cell, game, playerId }) =>
			!!adjacentCells(game, cell.x, cell.y).find((c) => c.ownerId === playerId),
	}),
	placement({
		code: PlacementCode.TwoCities,
		description: '',
		evaluate: ({ cell, game }) =>
			adjacentCells(game, cell.x, cell.y).filter(
				(c) => c.content === GridCellContent.City
			).length >= 2,
	}),
	placement({
		code: PlacementCode.OneCity,
		description: '',
		evaluate: ({ cell, game }) =>
			adjacentCells(game, cell.x, cell.y).filter(
				(c) => c.content === GridCellContent.City
			).length >= 1,
	}),
	placement({
		code: PlacementCode.OneForest,
		description: '',
		evaluate: ({ cell, game }) =>
			adjacentCells(game, cell.x, cell.y).filter(
				(c) => c.content === GridCellContent.Forest
			).length >= 1,
	}),
] as const

export const PlacementConditionsLookup = {
	data: PlacementConditions.reduce((acc, c) => {
		acc[c.code] = c
		return acc
	}, {} as Record<PlacementCode, PlacementCondition | undefined>),

	get(code: PlacementCode) {
		const c = this.data[code]
		if (!c) {
			throw new Error(`Failed to find placement condition ${code}`)
		}

		return c
	},
}

export const OceanPlacement = [PlacementCode.OceanOnly]
export const CityPlacement = [PlacementCode.NoOceans]
export const OtherPlacement = [PlacementCode.NoOceans, PlacementCode.NextToOwn]
export const ForestPlacement = [PlacementCode.NoOceans, PlacementCode.NextToOwn]

export const ContentToPlacement = {
	[GridCellContent.City]: CityPlacement,
	[GridCellContent.Other]: OtherPlacement,
	[GridCellContent.Forest]: ForestPlacement,
	[GridCellContent.Ocean]: OceanPlacement,
} as const

export const canPlace = (
	game: GameState,
	player: PlayerState,
	cell: GridCell,
	state: PlacementState
) => {
	let conditions = ContentToPlacement[state.type]

	if (state.conditions) {
		conditions = state.conditions
	} else {
		if (
			state.special &&
			state.special.length > 0 &&
			!state.special.find((s) => s === cell.special)
		) {
			return false
		}
	}

	const ctx: PlacementContext = {
		game,
		player: player.gameState,
		playerId: player.id,
		cell,
	}

	return conditions
		.map((c) => PlacementConditionsLookup.get(c))
		.every((c) => c.evaluate(ctx))
}