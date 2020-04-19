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
	]),
	cardPlayed: new GameSound([
		'audio/card-played-1',
		'audio/card-played-2',
		'audio/card-played-3',
		'audio/card-played-4'
	]),
	progressImproved: new GameSound(['audio/progress-improved'])
}
