import { GridCellContent } from '@shared/game'
import { placeTileAction } from '@shared/player-actions'
import { pushPendingAction } from '@shared/utils'
import { colonyBonus } from '../utils'

export const colonyTileBonus = (tileType: GridCellContent) =>
	colonyBonus({
		symbols: [{ tile: tileType }],
		perform: ({ player }) => {
			pushPendingAction(
				player,
				placeTileAction({
					type: tileType,
				}),
			)
		},
	})
