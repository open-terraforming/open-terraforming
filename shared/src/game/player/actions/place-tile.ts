import { cellByCoords, updatePlayerResource } from '@shared/cards/utils'
import {
	GameStateValue,
	GridCellContent,
	placeTile,
	PlayerStateValue,
} from '@shared/index'
import { canPlace } from '@shared/placements'
import { placeTileAction, PlayerActionType } from '@shared/player-actions'
import { adjacentCells, drawCards, f, pushPendingAction } from '@shared/utils'
import { PlayerBaseAction } from '../action'

type Args = ReturnType<typeof placeTile>['data']

export class PlaceTileAction extends PlayerBaseAction<Args> {
	states = [
		PlayerStateValue.Playing,
		PlayerStateValue.EndingTiles,
		PlayerStateValue.Prelude,
		PlayerStateValue.WorldGovernmentTerraform,
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

		const pendingTile = top.state

		if (!canPlace(this.game, this.player, cell, pendingTile)) {
			throw new Error(`You cannot place the tile here`)
		}

		this.logger.log(
			f(
				'Placed {0} at {1},{2}',
				GridCellContent[pendingTile.type],
				cell.x,
				cell.y,
			),
		)

		cell.content = pendingTile.type
		cell.other = pendingTile.other
		cell.ownerCard = pendingTile.ownerCard
		cell.placedById = this.player.id

		if (!top.anonymous) {
			cell.ownerId = this.player.id
			updatePlayerResource(this.player, 'ore', cell.ore)
			updatePlayerResource(this.player, 'titan', cell.titan)
			updatePlayerResource(this.player, 'plants', cell.plants)
			updatePlayerResource(this.player, 'heat', cell.heat)
			updatePlayerResource(this.player, 'money', cell.money)

			if (cell.cards > 0) {
				this.player.cards.push(...drawCards(this.game, cell.cards))
			}
		}

		if (cell.oceans > 0 && this.game.oceans < this.game.map.oceans) {
			pushPendingAction(
				this.player,
				placeTileAction({ type: GridCellContent.Ocean }, top.anonymous),
			)
		}

		switch (pendingTile.type) {
			case GridCellContent.Forest: {
				if (this.game.oxygen < this.game.map.oxygen) {
					this.game.oxygen++

					if (!top.anonymous) {
						this.player.terraformRating++
					}
				}

				break
			}

			case GridCellContent.Ocean: {
				if (!top.anonymous) {
					this.player.terraformRating++
				}

				this.game.oceans++
				break
			}
		}

		if (!top.anonymous) {
			this.player.money +=
				adjacentCells(this.game, cell.x, cell.y).filter(
					(c) => c.content === GridCellContent.Ocean,
				).length * 2
		}

		this.parent.onTilePlaced.emit({
			cell,
			player: this.parent,
		})

		this.parent.game.checkMilestones()

		// Make sure player spent all his plants in ending phase
		if (this.player.state == PlayerStateValue.EndingTiles) {
			this.parent.buyAllGreeneries()
		}

		this.popAction()
	}
}
