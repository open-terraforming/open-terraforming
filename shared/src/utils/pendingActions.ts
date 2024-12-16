import { PlayerActionType } from '@shared/player-actions'
import { PlayerStateValue, PlayerState } from '..'

export const allowedActions: Record<number, PlayerActionType[] | undefined> = {
	[PlayerStateValue.Picking]: [
		PlayerActionType.PickStarting,
		PlayerActionType.PickCards,
		PlayerActionType.PickPreludes,
		PlayerActionType.DraftCard,
	],
	[PlayerStateValue.Prelude]: [PlayerActionType.PlaceTile],
	[PlayerStateValue.EndingTiles]: [PlayerActionType.PlaceTile],
	[PlayerStateValue.Playing]: [],
	[PlayerStateValue.WorldGovernmentTerraform]: [
		PlayerActionType.WorldGovernmentTerraform,
		PlayerActionType.ClaimTile,
		PlayerActionType.PlaceTile,
	],
}

export const pendingActions = (player: PlayerState) => {
	const allowed = allowedActions[player.state]

	return allowed
		? allowed.length === 0
			? player.pendingActions
			: player.pendingActions.filter((p) => allowed.includes(p.type))
		: []
}
