import { updatePlayerResource } from '@shared/cards/utils'
import { buyMilestone, GameStateValue, PlayerStateValue } from '@shared/index'
import { Milestones, MilestoneType } from '@shared/milestones'
import { f } from '@shared/utils/f'
import { PlayerBaseActionHandler } from '../action'

type Args = ReturnType<typeof buyMilestone>['data']

export class BuyMilestoneAction extends PlayerBaseActionHandler<Args> {
	states = [PlayerStateValue.Playing]
	gameStates = [GameStateValue.GenerationInProgress]

	perform({ type }: Args) {
		if (this.pendingAction) {
			throw new Error("You've got pending actions to attend to")
		}

		if (!this.game.map.milestones.includes(type)) {
			throw new Error(`This milestone is not available no this board`)
		}

		if (this.game.milestones.length >= this.game.milestonesLimit) {
			throw new Error('All milestones are taken')
		}

		if (this.player.money < this.game.milestonePrice) {
			throw new Error("You can't afford a milestone")
		}

		if (this.game.milestones.find((c) => c.type === type)) {
			throw new Error('This milestone is already owned')
		}

		const milestone = Milestones[type]

		if (milestone.getValue(this.game, this.player) < milestone.limit) {
			throw new Error("You haven't reached this milestone")
		}

		this.logger.log(f('Bought milestone {0}', MilestoneType[type]))

		updatePlayerResource(this.player, 'money', -this.game.milestonePrice)

		this.game.milestones.push({
			playerId: this.player.id,
			type,
		})

		this.actionPlayed()
	}
}
