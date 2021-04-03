import {
	GridCell,
	GameState,
	GridCellType,
	PlayerGameState,
	GridCellContent,
	GridCellOther,
	GridCellSpecial,
	PlayerState
} from './game'
import { adjacentCells, allCells } from './utils'

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
	NextToOwnOrFree = 'next_to_owned_or_free',
	TwoCities = 'two_cities',
	OneCity = 'one_city',
	OneForest = 'one_forest',
	NoCity = 'no_city',
	NoctisCity = 'noctis_city'
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
		evaluate: ({ cell }) => cell.ore > 0 || cell.titan > 0
	}),
	placement({
		code: PlacementCode.OceanOnly,
		description: 'ocean area',
		evaluate: ({ cell }) => cell.type === GridCellType.Ocean
	}),
	placement({
		code: PlacementCode.NoOceans,
		description: 'outside oceans',
		evaluate: ({ cell }) => cell.type === GridCellType.General
	}),
	placement({
		code: PlacementCode.Isolated,
		description: 'isolated area',
		evaluate: ({ cell, game }) =>
			adjacentCells(game, cell.x, cell.y).every(c => !c.content)
	}),
	placement({
		code: PlacementCode.NextToOwn,
		description: 'next to your tile',
		evaluate: ({ cell, game, playerId }) =>
			!!adjacentCells(game, cell.x, cell.y).find(
				c => c.ownerId === playerId && c.content !== GridCellContent.Ocean
			)
	}),
	placement({
		code: PlacementCode.NextToOwnOrFree,
		description: 'next to your tile (if possible)',
		evaluate: ({ cell, game, playerId }) =>
			!allCells(game).find(
				c =>
					c.ownerId === playerId &&
					c.content !== GridCellContent.Ocean &&
					!!adjacentCells(game, c.x, c.y).find(
						c => !c.content && c.type !== GridCellType.NoctisCity
					)
			) ||
			!!adjacentCells(game, cell.x, cell.y).find(
				c => c.ownerId === playerId && c.content !== GridCellContent.Ocean
			)
	}),
	placement({
		code: PlacementCode.TwoCities,
		description: 'next to at least two cities',
		evaluate: ({ cell, game }) =>
			adjacentCells(game, cell.x, cell.y).filter(
				c => c.content === GridCellContent.City
			).length >= 2
	}),
	placement({
		code: PlacementCode.OneCity,
		description: 'next to city',
		evaluate: ({ cell, game }) =>
			adjacentCells(game, cell.x, cell.y).filter(
				c => c.content === GridCellContent.City
			).length >= 1
	}),
	placement({
		code: PlacementCode.OneForest,
		description: 'next to forest',
		evaluate: ({ cell, game }) =>
			adjacentCells(game, cell.x, cell.y).filter(
				c => c.content === GridCellContent.Forest
			).length >= 1
	}),
	placement({
		code: PlacementCode.NoCity,
		description: 'next to no city',
		evaluate: ({ cell, game }) =>
			adjacentCells(game, cell.x, cell.y).filter(
				c =>
					c.content === GridCellContent.City &&
					c.special !== GridCellSpecial.NoctisCity
			).length === 0
	}),
	placement({
		code: PlacementCode.NoctisCity,
		description: 'on Noctis City or as normal city if map has no Noctis City',
		evaluate: ({ game, cell }) => {
			// Noctis city has special treatment only when there's a Noctis city cell
			const hasNoctisCell =
				allCells(game).find(c => c.type === GridCellType.NoctisCity) !==
				undefined

			if (hasNoctisCell) {
				return cell.type === GridCellType.NoctisCity
			} else {
				// Normal city condition (no neighboring city)
				return (
					adjacentCells(game, cell.x, cell.y).filter(
						c =>
							c.content === GridCellContent.City &&
							c.special !== GridCellSpecial.NoctisCity
					).length === 0
				)
			}
		}
	})
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
	}
}

export const OceanPlacement = [PlacementCode.OceanOnly]
export const CityPlacement = [PlacementCode.NoOceans, PlacementCode.NoCity]
export const OtherPlacement = [PlacementCode.NoOceans]
export const ForestPlacement = [
	PlacementCode.NoOceans,
	PlacementCode.NextToOwnOrFree
]

export const ContentToPlacement = {
	[GridCellContent.City]: CityPlacement,
	[GridCellContent.Other]: OtherPlacement,
	[GridCellContent.Forest]: ForestPlacement,
	[GridCellContent.Ocean]: OceanPlacement
} as const

export const canPlace = (
	game: GameState,
	player: PlayerState,
	cell: GridCell,
	state: PlacementState
) => {
	// Check if tile isn't already used or claimed
	if (
		cell.content !== undefined ||
		(cell.claimantId !== undefined && cell.claimantId !== player.id)
	) {
		return false
	}

	// Check if player can afford placing tile here
	if (
		(['money', 'ore', 'titan', 'heat', 'plants'] as const).find(
			r => cell[r] < 0 && player[r] < -cell[r]
		)
	) {
		return false
	}

	let conditions = ContentToPlacement[state.type]

	if (state.conditions) {
		// Conditions are specified explicitly, use those
		conditions = state.conditions
	} else {
		// If there's special cell specified, no other conditions are required
		const special = state.special

		if (special && special.length > 0) {
			// If the board doesn't contain any of the special cells, switch to "other" placement conditions
			if (allCells(game).find(c => c.special && special.includes(c.special))) {
				return !!special.find(s => s === cell.special)
			} else {
				conditions = OtherPlacement
			}
		}
	}

	const ctx: PlacementContext = {
		game,
		player: player,
		playerId: player.id,
		cell
	}

	return conditions
		.map(c => PlacementConditionsLookup.get(c))
		.every(c => c.evaluate(ctx))
}

export const isClaimable = (cell: GridCell) =>
	cell.content === undefined &&
	cell.claimantId === undefined &&
	cell.type === GridCellType.General

export const canPlaceAnywhere = (
	game: GameState,
	player: PlayerState,
	state: PlacementState
) => allCells(game).find(c => canPlace(game, player, c, state)) !== undefined
