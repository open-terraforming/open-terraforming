import { removeDelegateActionRequest } from '@shared/actions'
import { getPartyState } from '@shared/expansions/turmoil/utils/getPartyState'
import { recalculateDominantParty } from '@shared/expansions/turmoil/utils/recalculateDominantParty'
import { recalculatePartyLeader } from '@shared/expansions/turmoil/utils/recalculatePartyLeader'
import { GameStateValue, PlayerStateValue } from '@shared/gameState'
import { PlayerBaseActionHandler } from '../action'

type Args = ReturnType<typeof removeDelegateActionRequest>['data']

export class RemoveDelegateActionHandler extends PlayerBaseActionHandler<Args> {
	// TODO: This has to be adjusted for paradigm_breakdown to allow discarding cards during global event
	states = [PlayerStateValue.Playing]
	gameStates = [GameStateValue.GenerationInProgress]

	perform({ party, playerId }: Args): void {
		const partyState = getPartyState(this.game, party)

		const delegateIndex = partyState.members.findIndex(
			(m) => m.playerId?.id === playerId,
		)

		if (delegateIndex === -1) {
			throw new Error('Delegate not found')
		}

		partyState.members.splice(delegateIndex, 1)

		recalculatePartyLeader(partyState)
		recalculateDominantParty(this.game)

		this.popAction()
	}
}
