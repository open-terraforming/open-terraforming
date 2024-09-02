import { GameState } from '@shared/game'

export enum ModifierType {
	NoAggressiveCard = 1,
}

export type Modifier = {
	type: ModifierType
	apply: (game: GameState) => void
}
