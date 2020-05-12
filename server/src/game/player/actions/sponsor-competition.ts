import { updatePlayerResource } from '@shared/cards/utils'
import { CompetitionType } from '@shared/competitions'
import {
	GameStateValue,
	PlayerStateValue,
	sponsorCompetition
} from '@shared/index'
import { PlayerActionType } from '@shared/player-actions'
import { competitionPrice, f } from '@shared/utils'
import { PlayerBaseAction } from '../action'

type Args = ReturnType<typeof sponsorCompetition>['data']

export class SponsorCompetitionAction extends PlayerBaseAction<Args> {
	states = [PlayerStateValue.Playing]
	gameStates = [GameStateValue.GenerationInProgress]

	perform({ type }: Args) {
		const top = this.pendingAction

		if (top) {
			if (top.type !== PlayerActionType.SponsorCompetition) {
				throw new Error("You've got pending actions to attend to.")
			}
		} else {
			const sponsored = this.game.competitions.length

			if (sponsored >= this.game.competitionsLimit) {
				throw new Error('All competitions are taken')
			}

			const cost = competitionPrice(this.game)

			if (this.player.money < cost) {
				throw new Error("You can't afford a competition")
			}

			if (this.game.competitions.find(c => c.type === type)) {
				throw new Error('This competition is already sponsored')
			}

			updatePlayerResource(this.player, 'money', -cost)
		}

		this.logger.log(f('Sponsored {0} competition', CompetitionType[type]))

		this.game.competitions.push({
			playerId: this.player.id,
			type
		})

		if (top) {
			this.popAction()
		} else {
			this.actionPlayed()
		}
	}
}
