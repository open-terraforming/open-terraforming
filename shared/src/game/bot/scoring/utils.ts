import { GameState, PlayerState } from '@shared/index'
import { pickRandom } from '@shared/utils/pickRandom'
import { shuffle } from '@shared/utils/shuffle'
import { deepCopy } from '@shared/utils/collections'

export const pickBest = <T>(values: T[], scoring: (v: T) => number) => {
	if (values.length === 0) {
		return undefined
	}

	// Sort values based on score
	const sortedValues = values
		.map((v) => [scoring(v), v] as const)
		.sort(([a], [b]) => b - a)

	// Pick best score
	const bestScore = sortedValues[0][0]

	// Pick all values with the best score (if there's more than 1)
	const bestValues = sortedValues.filter(([score]) => score === bestScore)

	// Pick a random value from the best values
	return pickRandom(bestValues)[1]
}

export const pickBestScore = <T>(values: T[], scoring: (v: T) => number) => {
	if (values.length === 0) {
		return 0
	}

	return shuffle(values)
		.map((v) => [scoring(v), v] as const)
		.sort(([a], [b]) => b - a)[0][0]
}

export const moneyCostScore = (player: PlayerState, cost: number) =>
	Math.pow(Math.min(1, cost / player.money), 3) * 15

export const copyGame = (game: GameState, player: PlayerState) => {
	const gameCopy = deepCopy(game)
	const playerCopy = gameCopy.players.find((p) => p.id === player.id)

	if (!playerCopy) {
		throw new Error('failed to find player copy')
	}

	return { gameCopy, playerCopy }
}
