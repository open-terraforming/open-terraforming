import { GameSound } from './sound'

export const Sounds = {
	playerChanged: new GameSound(['audio/player-changed']),
	nextGeneration: new GameSound(['audio/next-generation']),
	oceanPlaced: new GameSound(['audio/ocean-placed']),
	cityPlaced: new GameSound(['audio/city-placed']),
	otherPlaced: new GameSound(['audio/other-placed']),
	greeneryPlaced: new GameSound([
		'audio/greenery-placed-1',
		'audio/greenery-placed-2'
	])
}
