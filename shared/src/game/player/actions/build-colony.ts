import { buildColony } from '@shared/actions'
import { performBuildColony } from '@shared/expansions/colonies/actions/performBuildColony'
import { GameStateValue, PlayerStateValue } from '@shared/gameState'
import { PlayerActionType } from '@shared/player-actions'
import { PlayerBaseActionHandler } from '../action'
import { deepCopy } from '@shared/utils/collections'
import { EventType } from '@shared/index'

type Args = ReturnType<typeof buildColony>['data']

export class BuildColonyAction extends PlayerBaseActionHandler<Args> {
	states = [PlayerStateValue.Playing]
	gameStates = [GameStateValue.GenerationInProgress]

	perform({ colonyIndex }: Args): void {
		const colony = this.game.colonies[colonyIndex]
		const pendingAction = this.pendingAction

		const collector = this.startCollectingEvents()

		performBuildColony({
			game: this.game,
			player: this.player,
			colonyIndex,
			forFree: pendingAction?.type === PlayerActionType.BuildColony,
			allowDuplicates:
				pendingAction?.type === PlayerActionType.BuildColony &&
				pendingAction.data.allowMoreColoniesPerColony,
		})

		this.parent.onColonyBuilt.emit({
			colony,
			player: this.parent,
		})

		collector.collectAndPush(
			(changes) =>
				({
					type: EventType.ColonyBuilt,
					playerId: this.player.id,
					colony: +colonyIndex,
					state: deepCopy(colony),
					changes,
				}) as const,
		)

		if (pendingAction) {
			this.popAction()
		} else {
			if (!this.pendingAction) {
				this.actionPlayed()
			}
		}
	}
}
