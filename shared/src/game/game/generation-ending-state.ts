import { GameStateValue } from '@shared/index'
import { EventType } from '../events/eventTypes'
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

		this.game.pushEvent({
			type: EventType.ProductionPhase,
		})

		events.collectAndPush((changes) => {
			const processedChanges = changes.filter(
				(e) => e.type === EventType.ResourcesChanged,
			)

			processedChanges.forEach((c) => {
				c.processed = true
			})

			return {
				type: EventType.ProductionDone,
				players: processedChanges,
			}
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
