import { PlayerState } from '@shared/game'

export const enqueueForDiscard = (
	player: PlayerState,
	cardHandIndex: number,
) => {
	player.cardsToDiscard = [...(player.cardsToDiscard ?? []), cardHandIndex]
}
