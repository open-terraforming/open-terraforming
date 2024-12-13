import { PlacementState } from '@shared/placements'
import { unprotectedCard } from './conditions'
import {
	CardCondition,
	CardEffect,
	CardEffectArgument,
	CardEffectTarget,
	WithOptional,
	ResourceCondition,
	CommitteePartyCondition,
	CardEffectArgumentType,
	Resource,
} from './types'
import { GridCellLocation } from '..'

export const effectArg = <TResult = CardEffectArgumentType>(
	c: WithOptional<
		CardEffectArgument,
		'playerConditions' | 'cardConditions' | 'optional' | 'resourceConditions'
	>,
) =>
	({
		playerConditions: [],
		cardConditions: [],
		cellConditions: [],
		resourceConditions: [],
		optional: true,
		...c,
	}) as CardEffectArgument<TResult>

export const effectChoiceArg = (effects: CardEffect[]) =>
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	effectArg<[choice: number, choiceParams: any[]]>({
		type: CardEffectTarget.EffectChoice,
		effects,
	})

export const cardArg = (
	conditions: CardCondition[] = [],
	descriptionPrefix?: string,
	descriptionPostfix?: string,
	extra?: Partial<CardEffectArgument>,
) =>
	effectArg<number>({
		type: CardEffectTarget.Card,
		cardConditions: conditions,
		descriptionPrefix,
		descriptionPostfix,
		...extra,
	})

export const tileArg = (
	state: PlacementState,
	descriptionPrefix?: string,
	descriptionPostfix?: string,
) =>
	effectArg<[x: number, y: number, location: GridCellLocation | null]>({
		type: CardEffectTarget.Tile,
		descriptionPrefix,
		descriptionPostfix,
		tilePlacementState: state,
	})

export const playerCardArg = (
	conditions: CardCondition[] = [],
	amount = 0,
	extra?: Partial<CardEffectArgument>,
) =>
	effectArg<[player: number, cardIndex: number]>({
		type: CardEffectTarget.PlayerCardResource,
		cardConditions: [...conditions, unprotectedCard()],
		amount,
		...extra,
	})

export const resourceTypeArg = (resourceConditions: ResourceCondition[] = []) =>
	effectArg<Resource>({
		type: CardEffectTarget.ResourceType,
		resourceConditions,
	})

export const committeePartyArg = (conditions?: CommitteePartyCondition[]) =>
	effectArg<string>({
		type: CardEffectTarget.CommitteeParty,
		committeePartyConditions: conditions,
	})

export const committeePartyMemberArg = (
	conditions?: CommitteePartyCondition[],
) =>
	effectArg<[partyCode: string, memberPlayerId: number | null]>({
		type: CardEffectTarget.CommitteePartyMember,
		committeePartyConditions: conditions,
	})
