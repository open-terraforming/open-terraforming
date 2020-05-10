import { GameState } from '@shared/game'
import { deepCopy } from './collections'

const clearArray = (a: string[], cards?: Record<string, string>) =>
	a.map(c => (cards && cards[c]) || '')

export const obfuscateGame = (
	g: GameState,
	playerId: number,
	cards: Record<string, string>
) => {
	const copy = deepCopy(g)

	const toClear = [
		'cards',
		'discarded',
		'preludeCards',
		'preludeDiscarded',
		'corporations',
		'corporationsDiscarded'
	] as const

	toClear.forEach(k => {
		copy[k] = clearArray(copy[k], cards)
	})

	copy.players.forEach(p => {
		if (p.id !== playerId) {
			p.session = ''
			p.cards = clearArray(p.cards, cards)
		}
	})

	return copy
}
