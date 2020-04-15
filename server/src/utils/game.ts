import { GameState, PlayerState } from '@shared/game'
import { deepCopy } from './collections'

const clearArray = (a: string[]) => a.map(() => '')

export const obfuscateGame = (g: GameState, player?: PlayerState) => {
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
		copy[k] = clearArray(copy[k])
	})

	copy.players.forEach(p => {
		if (p.id !== player?.id) {
			p.session = ''
			p.cards = clearArray(p.cards)
		}
	})

	return copy
}
