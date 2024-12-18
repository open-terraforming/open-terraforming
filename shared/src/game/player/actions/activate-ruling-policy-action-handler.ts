import { activateRulingPolicyActionRequest } from '@shared/actions'
import { getRulingParty } from '@shared/expansions/turmoil/utils/getRulingParty'
import { GameStateValue, PlayerStateValue } from '@shared/gameState'
import { PlayerBaseActionHandler } from '../action'
import { EventType } from '@shared/game/events/eventTypes'

type Args = ReturnType<typeof activateRulingPolicyActionRequest>['data']

export class ActivateRulingPolicyActionHandler extends PlayerBaseActionHandler<Args> {
	states = [PlayerStateValue.Playing]
	gameStates = [GameStateValue.GenerationInProgress]

	perform({ index }: Args): void {
		const rulingParty = getRulingParty(this.game)

		if (!rulingParty) {
			throw new Error('No ruling party')
		}

		const policy = rulingParty.policy.active[index]

		if (
			policy.condition &&
			!policy.condition({ game: this.game, player: this.player })
		) {
			throw new Error('Player cannot activate this policy')
		}

		if (policy.oncePerGeneration && this.player.usedActiveRulingPartyPolicy) {
			throw new Error('Player already used active ruling party policy')
		}

		const collector = this.parent.game.startEventsCollector()

		rulingParty.policy.active[index].action({
			game: this.game,
			player: this.player,
		})

		this.player.usedActiveRulingPartyPolicy = true

		collector.collectAndPush((changes) => ({
			type: EventType.CommitteePartyActivePolicyActivated,
			playerId: this.player.id,
			changes,
			partyCode: rulingParty.code,
		}))

		if (!this.pendingAction) {
			this.actionPlayed()
		}
	}
}
