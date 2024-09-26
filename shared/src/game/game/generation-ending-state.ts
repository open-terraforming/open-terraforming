import { GameStateValue } from '@shared/index'
import { BaseGameState } from './base-game-state'
import { deepCopy } from '@shared/utils/collections'
import { EventType } from '../events/eventTypes'
import { buildEvents } from '../events/buildEvents'

export class GenerationEndingState extends BaseGameState {
	name = GameStateValue.GenerationEnding

	onEnter() {
		this.state.state = GameStateValue.GenerationEnding
		this.game.handleGenerationEnd()

		this.doProduction()
	}

	doProduction() {
		const startingState = deepCopy(this.game.state)

		for (const p of this.game.players) {
			p.endGeneration()
		}

		this.game.pushEvent({
			type: EventType.ProductionDone,
			players: buildEvents(startingState, this.game.state).filter(
				(e) => e.type === EventType.ResourcesChanged,
			),
		})
	}

	transition() {
		if (this.game.isMarsTerraformed) {
			return GameStateValue.EndingTiles
		} else {
			return GameStateValue.GenerationStart
		}
	}
}
