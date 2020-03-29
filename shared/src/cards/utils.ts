import {
	WithOptional,
	CardEffect,
	CardCondition,
	Resource,
	Card,
	CardEffectArgument,
	CardEffectTarget,
	GameProgress,
} from './types'
import { GameState } from '../game'

const resourceProduction = {
	money: 'moneyProduction',
	ore: 'oreProduction',
	titan: 'titanProduction',
	plants: 'plantsProduction',
	energy: 'energyProduction',
	heat: 'heatProduction',
} as const

const gamePlayer = (game: GameState, playerId: number) => {
	const p = game.players.find((p) => p.id === playerId)
	if (!p) {
		throw new Error(`Failed to find player #${playerId}`)
	}
	return p.gameState
}

export const effect = (c: WithOptional<CardEffect, 'args' | 'conditions'>) =>
	({
		args: [],
		conditions: [],
		...c,
	} as CardEffect)

export const effectArg = (
	c: WithOptional<CardEffectArgument, 'playerConditions'>
) =>
	({
		playerConditions: [],
		...c,
	} as CardEffectArgument)

export const condition = (c: CardCondition) => c

export const gameProgressConditionMin = (res: GameProgress, value: number) =>
	condition({
		evaluate: (_state, game) => game[res] >= value,
		description: `${res} has to be at least ${value}`,
	})

export const gameProgressConditionMax = (res: GameProgress, value: number) =>
	condition({
		evaluate: (_state, game) => game[res] >= value,
		description: `${res} has to be at most ${value}`,
	})

export const resourceCondition = (res: Resource, value: number) =>
	condition({
		evaluate: (state) => state[res] >= value,
		description: `You have to at least ${value} of ${res}`,
	})

export const resourceChange = (res: Resource, change: number) =>
	effect({
		conditions: change < 0 ? [resourceCondition(res, -change)] : [],
		description:
			change > 0
				? `You'll receive ${change} of ${res}`
				: `You'll loose ${-change} of ${res}`,
		perform: (state) => {
			state[res] += change
		},
	})

export const productionCondition = (res: Resource, value: number) => {
	const prod = resourceProduction[res]
	return condition({
		evaluate: (state) => state[prod] >= value,
		description: `Your production of ${res} has to be at least ${value}`,
	})
}

export const productionChange = (res: Resource, change: number) => {
	const prod = resourceProduction[res]
	return effect({
		conditions: change < 0 ? [productionCondition(res, -change)] : [],
		description:
			change > 0
				? `Your production of ${res} will increase by ${change}`
				: `Your production of ${res} will decrease by ${change}`,
		perform: (state) => {
			state[prod] += change
		},
	})
}

export const playerResourceChange = (res: Resource, change: number) => {
	return effect({
		args: [
			effectArg({
				type: CardEffectTarget.Player,
				playerConditions: change < 0 ? [resourceCondition(res, -change)] : [],
			}),
		],
		description:
			change > 0
				? `Give ${change} of ${res} to any player`
				: `Remove ${change} of ${res} from any player`,
		perform: (_state, game, _card, playerId: number) => {
			playerId >= 0 && (gamePlayer(game, playerId)[res] += change)
		},
	})
}

export const playerProductionChange = (res: Resource, change: number) => {
	const prod = resourceProduction[res]
	return effect({
		args: [
			effectArg({
				type: CardEffectTarget.Player,
				playerConditions: change < 0 ? [productionCondition(res, -change)] : [],
				description: `Decrease ${res} production by ${change} of`,
			}),
		],
		description:
			change > 0
				? `Increase ${res} production of any player by ${change}`
				: `Decrease ${res} production of any player by ${change}`,
		perform: (_state, game, _card, playerId: number) => {
			playerId >= 0 && (gamePlayer(game, playerId)[prod] += change)
		},
	})
}

export const card = (
	c: WithOptional<
		Card,
		| 'conditions'
		| 'playEffects'
		| 'permanentEffects'
		| 'actionEvents'
		| 'victoryPoints'
	>
) =>
	({
		victoryPoints: 0,
		conditions: [],
		permanentEffects: [],
		playEffects: [],
		actionEvents: [],
		...c,
	} as Card)
