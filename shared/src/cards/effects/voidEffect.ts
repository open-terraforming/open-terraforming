import { CardSymbol } from '../types'
import { effect } from './types'

export const voidEffect = (symbols: CardSymbol[], description?: string) =>
	effect({
		description,
		symbols,
		perform: () => {},
	})
