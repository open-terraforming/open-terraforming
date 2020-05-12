import { adminChange } from '@shared/index'
import { PlayerBaseAction } from './action'

type Args = ReturnType<typeof adminChange>['data']

export class AdminChangeAction extends PlayerBaseAction<Args> {
	states = []
	gameStates = []

	perform(change: Args) {
		if (this.player.admin) {
			this.parent.game.adminChange(change)
		}
	}
}
