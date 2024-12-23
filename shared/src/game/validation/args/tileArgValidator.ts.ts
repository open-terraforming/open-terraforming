import { canPlace } from '@shared/placements'
import { argValidator } from './argValidator'
import { cellByCoords } from '@shared/cards/utils'

export const tileArgValidator = argValidator(
	({ a, ctx: { game, player }, usedTiles, value }) => {
		if (
			!Array.isArray(value) ||
			value.length < 2 ||
			value.length > 3 ||
			typeof value[0] !== 'number' ||
			typeof value[1] !== 'number' ||
			(value[2] !== null && typeof value[2] !== 'number')
		) {
			throw new Error('Invalid position supplied')
		}

		if (!a.tilePlacementState) {
			throw new Error(
				"No tile placement state for tileArg - this shouldn't happen",
			)
		}

		const cell = cellByCoords(game, value[0], value[1], value[2] ?? undefined)

		if (!cell) {
			throw new Error('Cell not found')
		}

		if (
			usedTiles.some(
				(t) => t.x === cell.x && t.y === cell.y && t.location === cell.location,
			)
		) {
			throw new Error('This tile has already been used')
		}

		if (!canPlace(game, player, cell, a.tilePlacementState)) {
			throw new Error(`You cannot place the tile here`)
		}
	},
)
