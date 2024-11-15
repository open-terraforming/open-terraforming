import { GridCellContent } from '@shared/gameState'
import { placeTileAction } from '@shared/player-actions'
import { pushPendingAction } from '@shared/utils/pushPendingAction'
import { colonyBonus } from '../templates/colonyBonus'

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
