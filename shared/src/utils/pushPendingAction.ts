import { PlayerAction } from "@shared/player-actions";
import { PlayerState } from "..";


export const pushPendingAction = (
	player: PlayerState,
	action: PlayerAction
) => {
	player.pendingActions.push(action);
};
