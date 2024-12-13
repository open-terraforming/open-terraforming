import { PlacementState } from '@shared/placements'
import { cellByCoords, updatePlayerResource } from '@shared/cards/utils'
import {
	GameState,
	GridCellContent,
	GridCellLocation,
	PlayerState,
} from '@shared/gameState'
import { drawCards } from './drawCards'
import { pushPendingAction } from './pushPendingAction'
import { placeTileAction } from '@shared/player-actions'
import { adjacentCells } from './adjacentCells'
import { adjacentOceansBonus } from './adjacentOceansBonus'

type Params = {
	game: GameState
	position: {
		x: number
		y: number
		location: GridCellLocation | undefined
	}
	player: PlayerState
	state: PlacementState
	anonymous: boolean
}

export const applyTilePlace = ({
	game,
	position,
	player,
	state,
	anonymous,
}: Params) => {
	const cell = cellByCoords(game, position.x, position.y, position.location)

	if (!cell) {
		throw new Error('Cell not found')
	}

	cell.content = state.type
	cell.other = state.other
	cell.ownerCard = state.ownerCard
	cell.placedById = player.id

	if (!anonymous) {
		cell.ownerId = player.id
		updatePlayerResource(player, 'ore', cell.ore)
		updatePlayerResource(player, 'titan', cell.titan)
		updatePlayerResource(player, 'plants', cell.plants)
		updatePlayerResource(player, 'heat', cell.heat)
		updatePlayerResource(player, 'money', cell.money)

		if (cell.cards > 0) {
			player.cards.push(...drawCards(game, cell.cards))
		}
	}

	if (cell.oceans > 0 && game.oceans < game.map.oceans) {
		pushPendingAction(
			player,
			placeTileAction({ type: GridCellContent.Ocean }, anonymous),
		)
	}

	switch (state.type) {
		case GridCellContent.Forest: {
			if (game.oxygen < game.map.oxygen) {
				game.oxygen++

				if (!anonymous) {
					player.terraformRating++
					player.terraformRatingIncreasedThisGeneration = true
				}
			}

			break
		}

		case GridCellContent.Ocean: {
			if (!anonymous) {
				player.terraformRating++
				player.terraformRatingIncreasedThisGeneration = true
			}

			game.oceans++
			break
		}
	}

	if (!anonymous) {
		player.money +=
			adjacentCells(game, cell.x, cell.y).filter(
				(c) => c.content === GridCellContent.Ocean,
			).length * adjacentOceansBonus(game, player)
	}

	// TODO: HOW?
	/*
	this.parent.onTilePlaced.emit({
		cell,
		player: this.parent,
	})

	this.parent.game.checkMilestones()

	// Make sure player spent all his plants in ending phase
	if (this.player.state == PlayerStateValue.EndingTiles) {
		this.parent.buyAllGreeneries()
	}
	*/
}
