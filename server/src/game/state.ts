import { GameStateValue, PlayerStateValue } from '@shared/index'

export const transitions = {
	[GameStateValue.WaitingForPlayers]: {
		[PlayerStateValue.Waiting]: [PlayerStateValue.Ready]
	},
	[GameStateValue.PickingCorporations]: {
		[PlayerStateValue.PickingCorporation]: [PlayerStateValue.Ready]
	},
	[GameStateValue.PickingCards]: {
		[PlayerStateValue.PickingCards]: [PlayerStateValue.Ready]
	},
	[GameStateValue.GenerationInProgress]: {
		[PlayerStateValue.WaitingForTurn]: [PlayerStateValue.Playing],
		[PlayerStateValue.Playing]: [
			PlayerStateValue.Passed,
			PlayerStateValue.Passed
		]
	}
}
