import { CardEffect, CardEffectType, WithOptional } from '../types'
import { CardEffectArgument } from '../args'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const effect = <TArgs extends CardEffectArgument<any>[] = []>(
	c: WithOptional<
		CardEffect<TArgs>,
		'args' | 'conditions' | 'type' | 'symbols' | 'aiScore'
	>,
): CardEffect<TArgs> =>
	({
		args: [],
		conditions: [],
		symbols: [],
		type: CardEffectType.Other,
		aiScore: 0,
		...c,
	}) as CardEffect<TArgs>
