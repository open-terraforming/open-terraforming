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
	[PlayerStateValue.SolarPhaseTerraform]: [
		PlayerActionType.SolarPhaseTerraform,
		PlayerActionType.ClaimTile,
		PlayerActionType.PlaceTile,
		PlayerActionType.DiscardCards,
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
