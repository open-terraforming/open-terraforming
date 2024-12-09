import { Resource, SymbolType } from '@shared/cards'
import { effect } from '@shared/cards/effects/types'
import { updatePlayerResource } from '@shared/cards/utils'
import { withUnits } from '@shared/units'
import { adjacentCells, allTiles, f } from '@shared/utils'

export const resourceForEmptyAdjacentTilesEffect = (
	resource: Resource,
	amountPerTile: number,
) =>
	effect({
		description: f(
			`Gain {0} for each empty tile adjacent to your tiles`,
			withUnits(resource, amountPerTile),
		),
		symbols: [
			{ resource, count: amountPerTile },
			{ symbol: SymbolType.Slash },
			{ symbol: SymbolType.Tile },
		],
		perform: ({ game, player }) => {
			const ownedTiles = allTiles(game).ownedBy(player.id).asArray()

			const emptyAdjacentTiles = new Set(
				ownedTiles.flatMap((tile) =>
					adjacentCells(game, tile.x, tile.y).filter((tile) => !tile.content),
				),
			)

			updatePlayerResource(
				player,
				resource,
				Math.floor(emptyAdjacentTiles.size * amountPerTile),
			)
		},
	})
