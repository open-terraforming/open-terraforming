import { cellByCoords } from '@shared/cards/utils'
import { claimTile, GameStateValue, PlayerStateValue } from '@shared/index'
import { isClaimable } from '@shared/placements'
import { PlayerActionType } from '@shared/player-actions'
import { f } from '@shared/utils/f'
import { PlayerBaseActionHandler } from '../action'

type Args = ReturnType<typeof claimTile>['data']

export class ClaimTileAction extends PlayerBaseActionHandler<Args> {
	states = [PlayerStateValue.Playing, PlayerStateValue.EndingTiles]
	gameStates = [GameStateValue.GenerationInProgress, GameStateValue.EndingTiles]

	perform({ x, y, location }: Args) {
		const top = this.pendingAction

		if (top?.type !== PlayerActionType.ClaimTile) {
			throw new Error("You're not claiming now")
		}

		const cell = cellByCoords(this.game, x, y, location)

		if (!cell) {
			throw new Error('Cell not found')
		}

		if (!isClaimable(cell)) {
			throw new Error(`This cell is reserved or owned by someone else`)
		}

		this.logger.log(f('Claimed {0},{1}', cell.x, cell.y))

		cell.claimantId = this.player.id

		this.popAction()
	}
}
