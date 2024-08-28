import { GameProgress, SymbolType } from '../cards'

export const progressToSymbol = (progress: GameProgress) => {
	switch (progress) {
		case 'temperature':
			return SymbolType.Temperature
		case 'oxygen':
			return SymbolType.Oxygen
		case 'venus':
			return SymbolType.Venus
		case 'oceans':
			return SymbolType.X
	}
}
