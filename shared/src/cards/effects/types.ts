import {
	CardEffectArgumentType,
	WithOptional,
	CardEffect,
	CardEffectType
} from '../types'

export const effect = <T extends (CardEffectArgumentType | undefined)[]>(
	c: WithOptional<
		CardEffect<T>,
		'args' | 'conditions' | 'type' | 'symbols' | 'aiScore'
	>
): CardEffect<T> =>
	({
		args: [],
		conditions: [],
		symbols: [],
		type: CardEffectType.Other,
		aiScore: 0,
		...c
	} as CardEffect<T>)
