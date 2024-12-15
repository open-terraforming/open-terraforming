import { cellByCoords } from '@shared/cards/utils'
import { GameStateValue, placeTile, PlayerStateValue } from '@shared/index'
import { PlayerActionType } from '@shared/player-actions'
import { applyTilePlace } from '@shared/utils/applyTilePlace'
import { PlayerBaseActionHandler } from '../action'

type Args = ReturnType<typeof placeTile>['data']

export class PlaceTileAction extends PlayerBaseActionHandler<Args> {
	states = [
		PlayerStateValue.Playing,
		PlayerStateValue.EndingTiles,
		PlayerStateValue.Prelude,
		PlayerStateValue.SolarPhaseTerraform,
	]
	gameStates = [
		GameStateValue.GenerationInProgress,
		GameStateValue.EndingTiles,
		GameStateValue.Prelude,
		GameStateValue.SolarPhase,
	]

	perform({ x, y, location }: Args) {
		const top = this.pendingAction

		if (top?.type !== PlayerActionType.PlaceTile) {
			throw new Error("You're not placing tiles right now")
		}

		const cell = cellByCoords(this.game, x, y, location)

		if (!cell) {
			throw new Error('Cell not found')
		}

		applyTilePlace({
			game: this.game,
			position: { x, y, location },
			player: this.player,
			state: top.state,
			anonymous: top.anonymous,
		})

		this.parent.onTilePlaced.emit({
			cell,
			player: this.parent,
		})

		this.parent.game.checkMilestones()

		// Make sure player spent all his plants in ending phase
		if (this.player.state == PlayerStateValue.EndingTiles) {
			this.parent.buyAllGreeneries()
		}

		this.popAction(!top.anonymous)
	}
}
