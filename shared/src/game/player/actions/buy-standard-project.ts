import { updatePlayerResource } from '@shared/cards/utils'
import {
	buyStandardProject,
	EventType,
	GameStateValue,
	PlayerStateValue,
	StandardProjectType,
} from '@shared/index'
import { Projects } from '@shared/projects'
import { f } from '@shared/utils/f'
import { PlayerBaseActionHandler } from '../action'

type Args = ReturnType<typeof buyStandardProject>['data']

export class BuyStandardProjectAction extends PlayerBaseActionHandler<Args> {
	states = [PlayerStateValue.Playing]
	gameStates = [GameStateValue.GenerationInProgress]

	perform({ project: projectType, args }: Args) {
		if (this.pendingAction) {
			throw new Error("You've got pending actions to attend to")
		}

		const projectState = this.game.standardProjects.find(
			(p) => p.type === projectType,
		)

		if (!projectState) {
			throw new Error('Project type not supported by current game')
		}

		const project = Projects[projectType]

		const ctx = {
			game: this.game,
			player: this.player,
		}

		if (!project.conditions.every((c) => c(ctx))) {
			throw new Error(`You cannot execute ${StandardProjectType[projectType]}`)
		}

		const collector = this.startCollectingEvents()

		updatePlayerResource(this.player, project.resource, -project.cost(ctx))
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		project.execute(ctx, ...(args as any[]))

		this.logger.log(
			f('Bought standard project {0}', StandardProjectType[projectType]),
		)

		this.parent.onProjectBought.emit({
			player: this.parent,
			project: project,
		})

		projectState.usedByPlayerIds.push(this.player.id)

		this.parent.game.checkMilestones()

		collector.collectAndPush((changes) => ({
			type: EventType.StandardProjectBought,
			playerId: this.player.id,
			project: projectType,
			changes,
		}))

		if (!this.pendingAction) {
			this.actionPlayed()
		}
	}
}
