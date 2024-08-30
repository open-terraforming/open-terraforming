import { PlaceTileAction } from '../place-tile'
import {
	PlayerStateValue,
	GameStateValue,
	GridCellContent,
} from '@shared/index'
import { pushPendingAction } from '@shared/utils'
import { placeTileAction } from '@shared/player-actions'
import { prepareGame } from '@shared/utils/tests'

test('should crash when player is in wrong state', () => {
	const { player, game, action } = prepareGame(
		(player) => new PlaceTileAction(player),
	)

	game.state = GameStateValue.GenerationInProgress

	const invalidStates = [
		PlayerStateValue.Connecting,
		PlayerStateValue.Passed,
		PlayerStateValue.Picking,
		PlayerStateValue.Ready,
		PlayerStateValue.Waiting,
		PlayerStateValue.WaitingForTurn,
	]

	invalidStates.forEach((invalid) => {
		player.state = invalid
		expect(() => action.tryPerform({ x: 5, y: 5 })).toThrowError()
	})
})

test('should crash when game is in wrong state', () => {
	const { player, game, action } = prepareGame(
		(player) => new PlaceTileAction(player),
	)

	player.state = PlayerStateValue.Playing
	pushPendingAction(player, placeTileAction({ type: GridCellContent.Forest }))

	const invalidStates = [
		GameStateValue.GenerationStart,
		GameStateValue.Ended,
		GameStateValue.Starting,
		GameStateValue.WaitingForPlayers,
	]

	invalidStates.forEach((invalid) => {
		game.state = invalid
		expect(() => action.tryPerform({ x: 5, y: 5 })).toThrowError()
	})
})

test('should work for proper placements', () => {
	const { player, game, action } = prepareGame(
		(player) => new PlaceTileAction(player),
	)

	game.state = GameStateValue.GenerationInProgress
	player.state = PlayerStateValue.Playing
	pushPendingAction(player, placeTileAction({ type: GridCellContent.Forest }))

	expect(() => action.tryPerform({ x: 2, y: 2 })).not.toThrowError()

	expect(game.map.grid[2][2].content).toBe(GridCellContent.Forest)
	expect(game.map.grid[2][2].ownerId).toBe(player.id)
})
