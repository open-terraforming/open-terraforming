import { condition } from '@shared/cards/conditions'

export const anyPartyHasNeutralDelegateCondition = () =>
	condition({
		evaluate: ({ game }) =>
			game.committee.parties.some((p) =>
				p.members.some((m) => m.playerId === null),
			),
	})
