import { GameStateValue, playerPass, PlayerStateValue } from '@shared/index'
import { PlayerBaseAction } from '../action'

type Args = ReturnType<typeof playerPass>['data']

export class PassAction extends PlayerBaseAction<Args> {
	states = [PlayerStateValue.Playing, PlayerStateValue.EndingTiles]
	gameStates = [GameStateValue.GenerationInProgress]

	perform({ force }: Args) {
		this.logger.log('Passed, force:', force)

		// Force pass if everybody else passed
		if (
			this.game.players.every(
				p => p.id === this.player.id || p.state === PlayerStateValue.Passed
			)
		) {
			force = true
		}

		this.setState(
			this.player.actionsPlayed === 0 || force
				? PlayerStateValue.Passed
				: PlayerStateValue.WaitingForTurn
		)
	}
}
