import { CommitteePartiesLookupApi } from '@shared/CommitteePartiesLookupApi'
import { getPartyState } from '@shared/expansions/turmoil/utils/getPartyState'
import { argValidator } from './argValidator'

export const committeePartyMemberValidator = argValidator(
	({ ctx: { game }, value }) => {
		if (!Array.isArray(value)) {
			throw new Error(
				'Invalid committee party member argument - expected array, got ' +
					JSON.stringify(value),
			)
		}

		const [partyCode, playerId] = value

		if (typeof partyCode !== 'string') {
			throw new Error(
				'Invalid partyCode argument - expected string, got ' +
					JSON.stringify(partyCode),
			)
		}

		const party = CommitteePartiesLookupApi.getOptional(partyCode)

		if (!party) {
			throw new Error(`Invalid committee party: ${value}`)
		}

		if (typeof playerId !== 'number' && playerId !== null) {
			throw new Error(
				'Invalid playerId argument - expected number or null, got ' +
					JSON.stringify(playerId),
			)
		}

		const partyState = getPartyState(game, partyCode)

		if (!partyState.members.some((m) => m.playerId?.id === playerId)) {
			throw new Error(
				`Player ${playerId} is not a member of party ${partyCode}`,
			)
		}
	},
)
