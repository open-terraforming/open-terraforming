import { condition } from '@shared/cards/conditions'

export const chairmanIsNeutralCondition = () =>
	condition({
		description: 'Requires that the chairman is neutral.',
		evaluate: ({ game }) => game.committee.chairman?.playerId === null,
	})
