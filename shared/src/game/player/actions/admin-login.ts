import { adminLogin } from '@shared/index'
import { PlayerBaseActionHandler } from '../action'

type Args = ReturnType<typeof adminLogin>['data']

export class AdminLoginAction extends PlayerBaseActionHandler<Args> {
	states = []
	gameStates = []

	perform({ password }: Args) {
		if (this.parent.game.config.adminPassword !== password) {
			throw new Error('Invalid admin password')
		}

		this.logger.log('Logged in as admin')

		this.player.admin = true
	}
}
