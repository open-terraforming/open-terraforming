import { SymbolType } from '@shared/cards'
import { drawCards } from '@shared/utils'
import { globalEffect } from '../globalEffect'
import { getPlayerInfluence } from '../utils/getPlayerInfluence'

export const drawCardPerInfluenceGlobalEffect = () =>
	globalEffect({
		symbols: [
			{ symbol: SymbolType.Card },
			{ symbol: SymbolType.Slash },
			{ symbol: SymbolType.Influence },
		],
		description: 'Draw 1 card per influence.',
		apply(game) {
			for (const player of game.players) {
				const influence = getPlayerInfluence(game, player)

				if (influence > 0) {
					player.cards.push(...drawCards(game, influence))
				}
			}
		},
	})
