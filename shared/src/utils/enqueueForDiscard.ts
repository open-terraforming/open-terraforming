import { PlayerState } from '@shared/gameState'

export const enqueueForDiscard = (
	player: PlayerState,
	cardHandIndex: number,
) => {
	player.cardsToDiscard = [...(player.cardsToDiscard ?? []), cardHandIndex]
}
