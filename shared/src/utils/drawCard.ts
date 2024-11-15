import { GameState } from "..";
import { shuffle } from "./shuffle";


export const drawCard = (game: GameState) => {
	if (game.cards.length === 0) {
		game.cards = shuffle(game.discarded.slice(0));
		game.discarded = [];
	}

	if (game.cards.length === 0) {
		const played = game.players.reduce(
			(acc, p) => acc + p.cards.length + p.usedCards.length,
			0
		);

		throw new Error(
			`There are no more cards. Players have ${played} in their hands`
		);
	}

	return game.cards.pop() as string;
};
