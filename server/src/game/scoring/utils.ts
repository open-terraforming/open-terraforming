import { deepCopy } from '@/utils/collections'
import {
	CardEffect,
	CardEffectArgumentType,
	CardsLookupApi,
} from '@shared/cards'
import { resourceProduction, resources } from '@shared/cards/utils'
import {
	GameState,
	GridCellContent,
	PlayerState,
	UsedCardState,
} from '@shared/index'
import { canPlace } from '@shared/placements'
import { PlayerAction, PlayerActionType } from '@shared/player-actions'
import { adjTilesList, allCells, shuffle, sortBy, tiles } from '@shared/utils'
import { getPossibleArgs } from './args/get-possible-args'
import { placeTileScore } from './place-tile-score'

export const pickBest = <T>(values: T[], scoring: (v: T) => number) => {
	if (values.length === 0) {
		return undefined
	}

	return shuffle(values)
		.map((v) => [scoring(v), v] as const)
		.sort(([a], [b]) => b - a)[0][1]
}

export const pickBestScore = <T>(values: T[], scoring: (v: T) => number) => {
	if (values.length === 0) {
		return 0
	}

	return shuffle(values)
		.map((v) => [scoring(v), v] as const)
		.sort(([a], [b]) => b - a)[0][0]
}

const resScore = (g: GameState) => ({
	money: 0.9,
	ore: 0.7,
	titan: 0.7,
	heat: g.temperature < g.map.temperature ? 1 : 0,
	energy: g.temperature < g.map.temperature ? 0.8 : 0.2,
	plants: 1,
})

const computePendingActionScore = (
	g: GameState,
	p: PlayerState,
	a: PlayerAction,
) => {
	switch (a.type) {
		case PlayerActionType.ClaimTile:
			return 0.1
		case PlayerActionType.PickCards:
			return a.free ? a.limit : 0.5
		case PlayerActionType.PlaceTile:
			return pickBestScore(
				allCells(g).filter((c) => canPlace(g, p, c, a.state)),
				(c) => placeTileScore({ player: p, game: g }, a.state, c),
			)
		default:
			return 0
	}
}

export const computeScore = (g: GameState, p: PlayerState) => {
	return (
		p.terraformRating * 5 +
		p.titanPrice * 3 +
		p.orePrice * 3 +
		-p.cardPriceChange +
		(Object.values(p.tagPriceChange).reduce(
			(acc, p) => (acc ?? 0) + (p ?? 0),
			0,
		) ?? 0) +
		p.cards.length * 0.5 +
		resources.reduce(
			(acc, r) =>
				acc +
				p[r] * resScore(g)[r] +
				p[resourceProduction[r]] * resScore(g)[r] * 1.4,
			0,
		) +
		p.usedCards
			.map((c) => ({ state: c, info: CardsLookupApi.get(c.code) }))
			.reduce(
				(acc, { info, state }) =>
					acc +
					info.victoryPoints +
					(info.victoryPointsCallback
						? info.victoryPointsCallback.compute({
								player: p,
								game: g,
								card: state,
							})
						: 0),
				0,
			) +
		tiles(allCells(g))
			.ownedBy(p.id)
			.asArray()
			.reduce((acc, t) => {
				if (t.content === GridCellContent.City) {
					return acc + adjTilesList(g, t.x, t.y).hasGreenery().length
				}

				if (t.content === GridCellContent.Forest) {
					return acc + 1
				}

				return acc
			}, 0) *
			5 +
		p.pendingActions.reduce(
			(acc, a) => acc + computePendingActionScore(g, p, a),
			0,
		)
	)
}

export const getBestArgs = (
	game: GameState,
	player: PlayerState,
	cardState: UsedCardState,
	effects: CardEffect[],
) => {
	const possibleArguments = getPossibleArgs(player, game, effects, cardState)

	const evalEffect = (
		effectIndex: number,
		effectArgs: CardEffectArgumentType[][],
	): { score: number; args: CardEffectArgumentType[][] } => {
		if (effectIndex === effects.length) {
			const copyGame = deepCopy(game)
			const copyPlayer = copyGame.players.find((p) => p.id === player.id)
			const copyState = deepCopy(cardState)

			if (!copyPlayer) {
				throw new Error('Failed to find myself in game copy')
			}

			try {
				effects.forEach((e, ei) => {
					e.perform(
						{
							player: copyPlayer,
							game: copyGame,
							card: copyState,
						},
						...effectArgs[ei],
					)
				})
			} catch (e) {
				console.log('Failed to score', cardState.code, 'with', effectArgs)
				throw e
			}

			return {
				score: computeScore(copyGame, copyPlayer),
				args: [...effectArgs],
			}
		} else {
			const combinations = [] as CardEffectArgumentType[][]

			argCombinations(0, possibleArguments[effectIndex], [], combinations)

			const values = combinations.map((a) => {
				effectArgs[effectIndex] = a

				return evalEffect(effectIndex + 1, effectArgs)
			})

			if (values.length === 0) {
				effectArgs[effectIndex] = []

				return evalEffect(effectIndex + 1, effectArgs)
			}

			return sortBy(values, (v) => -v.score)[0]
		}
	}

	const argCombinations = (
		argIndex: number,
		choices: CardEffectArgumentType[][],
		result: CardEffectArgumentType[],
		results: CardEffectArgumentType[][],
	) => {
		if (argIndex === choices.length) {
			results.push(result)
		} else {
			choices[argIndex].map((c) => {
				argCombinations(argIndex + 1, choices, [...result, c], results)
			})
		}
	}

	return evalEffect(0, [])
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
