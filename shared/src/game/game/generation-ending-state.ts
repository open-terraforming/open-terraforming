import { GameStateValue } from '@shared/index'
import { EventType, ResourcesChanged } from '../events/eventTypes'
import { BaseGameState } from './base-game-state'

export class GenerationEndingState extends BaseGameState {
	name = GameStateValue.GenerationEnding

	onEnter() {
		this.state.state = GameStateValue.GenerationEnding
		this.game.handleGenerationEnd()

		this.doProduction()
	}

	doProduction() {
		const events = this.game.startEventsCollector()

		for (const p of this.game.players) {
			p.endGeneration()
		}

		this.game.state.events.push({
			type: EventType.ProductionPhase,
		})

		events.collectAndPush((changes) => ({
			type: EventType.ProductionDone,
			players: changes.filter(
				(e) => e.type === EventType.ResourcesChanged,
			) as ResourcesChanged[],
		}))
	}

	transition() {
		if (this.game.isMarsTerraformed) {
			return GameStateValue.EndingTiles
		} else {
			return GameStateValue.GenerationStart
		}
	}
}
