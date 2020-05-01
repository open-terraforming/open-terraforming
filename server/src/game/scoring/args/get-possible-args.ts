import {
	CardEffect,
	CardEffectArgument,
	CardEffectArgumentType,
	CardEffectTarget,
	Resource
} from '@shared/cards'
import { GameState, PlayerState, UsedCardState } from '@shared/index'
import { cardsList, range, shuffle } from '@shared/utils'

const getPossibleOptions = (
	player: PlayerState,
	game: GameState,
	a: CardEffectArgument,
	card: UsedCardState
): CardEffectArgumentType[] => {
	switch (a.type) {
		case CardEffectTarget.Card: {
			return a.fromHand
				? cardsList(player.cards)
						.fits(game, player, a.cardConditions)
						.map(c => player.cards.indexOf(c.info.code))
				: cardsList(player.usedCards)
						.fits(game, player, a.cardConditions)
						.map(c => player.usedCards.indexOf(c.state))
		}

		case CardEffectTarget.Player: {
			return game.players
				.filter(
					other =>
						other.id !== player.id &&
						!a.playerConditions.find(
							c =>
								!c.evaluate({
									game,
									player: other,
									card
								})
						)
				)
				.map(p => p.id)
				.concat(a.optional ? [-1] : [])
		}

		case CardEffectTarget.PlayerResource: {
			const res = a.resource

			if (!res) {
				throw new Error('PlayerResource arg requires resource prop')
			}

			return game.players
				.filter(
					other =>
						other.id !== player.id &&
						!a.playerConditions.find(
							c =>
								!c.evaluate({
									game,
									player: other,
									card
								})
						)
				)
				.map(p => {
					return range(1, p[res] + 1).map(r => [p.id, r])
				})
				.flat()
				.concat([[-1, 0]])
		}

		case CardEffectTarget.PlayerCardResource: {
			return game.players
				.filter(other => other.id !== player.id)
				.map(other => ({
					other,
					cards: shuffle(
						other.usedCards
							.filter(
								(card, cardIndex) =>
									!a.cardConditions.find(
										c =>
											!c.evaluate({
												card,
												cardIndex,
												game,
												player: other,
												playerId: other.id
											})
									)
							)
							.map(c => other.usedCards.indexOf(c))
					)
				}))
				.filter(({ cards }) => cards.length > 0)
				.map(({ other, cards }) => cards.map(c => [other.id, c]))
				.flat()
				.concat(a.optional ? [[-1, 0]] : [])
		}

		case CardEffectTarget.Resource: {
			return range(0, player[a.resource as Resource] + 1)
		}

		case CardEffectTarget.EffectChoice: {
			const effects = a.effects || []

			return effects
				.filter(
					e =>
						!e.conditions.find(
							c =>
								!c.evaluate({
									card,
									cardIndex: card.index,
									game,
									player,
									playerId: player.id
								})
						)
				)
				.map(e =>
					getPossibleArgs(player, game, [e], card).map(args => [
						effects.indexOf(e),
						args
					])
				)
				.flat()
		}

		default:
			return [-1]
	}
}

export const getPossibleArgs = (
	player: PlayerState,
	game: GameState,
	effects: CardEffect[],
	card: UsedCardState
): CardEffectArgumentType[][][] => {
	return effects.map(e =>
		e.args.length > 0
			? e.args.map(a => shuffle(getPossibleOptions(player, game, a, card)))
			: [[]]
	)
}
