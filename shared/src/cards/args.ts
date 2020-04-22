import { unprotectedCard } from './conditions'
import {
	CardCondition,
	CardEffect,
	CardEffectArgument,
	CardEffectTarget,
	CellCondition,
	WithOptional,
	ResourceCondition
} from './types'

export const effectArg = (
	c: WithOptional<
		CardEffectArgument,
		| 'playerConditions'
		| 'cardConditions'
		| 'optional'
		| 'cellConditions'
		| 'resourceConditions'
	>
) =>
	({
		playerConditions: [],
		cardConditions: [],
		cellConditions: [],
		resourceConditions: [],
		optional: true,
		...c
	} as CardEffectArgument)

export const effectChoiceArg = (effects: CardEffect[]) =>
	effectArg({
		type: CardEffectTarget.EffectChoice,
		effects
	})

export const cardArg = (
	conditions: CardCondition[] = [],
	descriptionPrefix?: string,
	descriptionPostfix?: string
) =>
	effectArg({
		type: CardEffectTarget.Card,
		cardConditions: conditions,
		descriptionPrefix,
		descriptionPostfix
	})

export const cellArg = (
	conditions: CellCondition[],
	descriptionPrefix?: string,
	descriptionPostfix?: string
) =>
	effectArg({
		type: CardEffectTarget.Cell,
		descriptionPrefix,
		descriptionPostfix,
		cellConditions: conditions
	})

export const playerCardArg = (conditions: CardCondition[] = [], amount = 0) =>
	effectArg({
		type: CardEffectTarget.PlayerCardResource,
		cardConditions: [...conditions, unprotectedCard()],
		amount
	})

export const resourceTypeArg = (resourceConditions: ResourceCondition[] = []) =>
	effectArg({
		type: CardEffectTarget.ResourceType,
		resourceConditions
	})
