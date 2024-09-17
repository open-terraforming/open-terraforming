import { GameState, PlayerState } from '@shared/game'

export const processCardsToDiscard = (
	game: GameState,
	player: PlayerState,
	justRemovedIndex?: number,
) => {
	// If we have removed an index from the player's hand, we need to adjust the indexes of the cards to discard
	const toDiscard = player.cardsToDiscard?.map((i) =>
		justRemovedIndex !== undefined && i > justRemovedIndex ? i - 1 : i,
	)

	if (toDiscard) {
		game.discarded.push(...toDiscard.map((i) => player.cards[i]))
		// We can't just use indexes to discard the cards - we have to make a new array
		player.cards = player.cards.filter((_, i) => !toDiscard.includes(i))
		player.cardsToDiscard = []
	}
}
