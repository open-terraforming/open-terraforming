import { CardEffect, CardEffectArgumentType } from '@shared/cards'
import { GameState, PlayerState, UsedCardState } from '@shared/index'
import { sortBy } from '@shared/utils/sortBy'
import { deepCopy } from '@shared/utils/collections'
import { getPossibleArgs } from './args/get-possible-args'
import { computeScore } from './computeScore'
import { AiScoringCoefficients } from './defaultScoringCoefficients'

export const getBestArgs = (
	s: AiScoringCoefficients,
	game: GameState,
	player: PlayerState,
	cardState: UsedCardState,
	effects: CardEffect[],
) => {
	const possibleArguments = getPossibleArgs(s, player, game, effects, cardState)

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
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						...(effectArgs[ei] as any),
					)
				})
			} catch (e) {
				console.error(
					'Failed to score',
					cardState.code,
					'with',
					effectArgs,
					'due to',
					e,
				)

				throw e
			}

			return {
				score: computeScore(s, copyGame, copyPlayer),
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
