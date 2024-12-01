import { condition } from '@shared/cards/conditions'

export const playerHasDelegateInReserveCondition = () =>
	condition({
		evaluate: ({ game, player }) =>
			game.committee.reserve.some((p) => p?.id === player.id),
	})
