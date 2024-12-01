import { GameState } from '@shared/index'
import { deepCopy } from './collections'

export interface ObfuscateNameCache {
	cards: Record<string, string>
	globalEvents: Record<string, string>
}

const clearArray = (a: string[], cards?: Record<string, string>) =>
	a.map((c) => (cards && cards[c]) || '')

export const obfuscateGame = (
	g: GameState,
	playerId: number,
	names: ObfuscateNameCache,
) => {
	const copy = deepCopy(g)

	const toClearBase = [
		'cards',
		'discarded',
		'preludeCards',
		'preludeDiscarded',
		'corporations',
		'corporationsDiscarded',
	] as const

	toClearBase.forEach((k) => {
		copy[k] = clearArray(copy[k], names.cards)
	})

	const toClearGlobalEvents = ['events', 'discardedEvents'] as const

	toClearGlobalEvents.forEach((k) => {
		copy.globalEvents[k] = clearArray(copy.globalEvents[k], names.globalEvents)
	})

	copy.players.forEach((p) => {
		if (p.id !== playerId) {
			p.session = ''
			p.cards = clearArray(p.cards, names.cards)
			p.draftedCards = clearArray(p.draftedCards, names.cards)
		}
	})

	return copy
}
