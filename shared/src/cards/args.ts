import { PlacementState } from '@shared/placements'
import { unprotectedCard } from './conditions'
import {
	CardCondition,
	CardEffect,
	CommitteePartyCondition,
	MaxAmountCallback,
	PlayerCondition,
	Production,
	Resource,
	ResourceCondition,
	WithOptional,
} from './types'
import { GridCellLocation } from '@shared/gameState'

export enum CardEffectTarget {
	Player = 1,
	PlayerResource,
	ResourceCount,
	ResourceType,
	ProductionCount,
	Card,
	PlayerCardResource,
	EffectChoice,
	Tile,
	CardResourceCount,
	CommitteeParty,
	CommitteePartyMember,
}

export type CardEffectArgument<
	TType extends CardEffectTarget = CardEffectTarget,
> = CardEffectArgumentBase<TType>

export interface CardEffectArgumentBase<TType extends CardEffectTarget> {
	type: TType
	descriptionPrefix?: string
	descriptionPostfix?: string
	playerConditions: PlayerCondition[]
	cardConditions: CardCondition[]
	resourceConditions: ResourceCondition[]
	committeePartyConditions?: CommitteePartyCondition[]
	/** Conditions for tile target */
	tilePlacementState?: PlacementState
	drawnCards?: number
	amount?: number
	maxAmount?: number | MaxAmountCallback
	optional: boolean
	resource?: Resource
	production?: Production
	fromHand?: boolean
	effects?: CardEffect[]
	minAmount?: number
	/** Allow selecting the card being played as the target - used for CARD inside playEffects */
	allowSelfCard?: boolean
	skipCurrentCard?: boolean
}

export interface CardEffectArgumentTypeToResultMap {
	[CardEffectTarget.Player]: number
	[CardEffectTarget.PlayerResource]: number
	[CardEffectTarget.ResourceCount]: number
	[CardEffectTarget.ResourceType]: Resource
	[CardEffectTarget.ProductionCount]: number
	[CardEffectTarget.Card]: number
	[CardEffectTarget.PlayerCardResource]: [player: number, cardIndex: number]
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[CardEffectTarget.EffectChoice]: [choice: number, choiceParams: any[]]
	[CardEffectTarget.Tile]: [
		x: number,
		y: number,
		location: GridCellLocation | null,
	]
	[CardEffectTarget.CardResourceCount]: number
	[CardEffectTarget.CommitteeParty]: string
	[CardEffectTarget.CommitteePartyMember]: [
		partyCode: string,
		memberPlayerId: number | null,
	]
}

export const effectArg = <TType extends CardEffectTarget>(
	c: WithOptional<
		CardEffectArgument<TType>,
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
	}) as CardEffectArgument<TType>

export const effectChoiceArg = (effects: CardEffect[]) =>
	effectArg({
		type: CardEffectTarget.EffectChoice,
		effects,
	})

export const cardArg = (
	conditions: CardCondition[] = [],
	descriptionPrefix?: string,
	descriptionPostfix?: string,
	extra?: Partial<CardEffectArgument<CardEffectTarget.Card>>,
) =>
	effectArg({
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
	effectArg({
		type: CardEffectTarget.Tile,
		descriptionPrefix,
		descriptionPostfix,
		tilePlacementState: state,
	})

export const playerCardArg = (
	conditions: CardCondition[] = [],
	amount = 0,
	extra?: Partial<CardEffectArgument<CardEffectTarget.PlayerCardResource>>,
) =>
	effectArg({
		type: CardEffectTarget.PlayerCardResource,
		cardConditions: [...conditions, unprotectedCard()],
		amount,
		...extra,
	})

export const resourceTypeArg = (resourceConditions: ResourceCondition[] = []) =>
	effectArg({
		type: CardEffectTarget.ResourceType,
		resourceConditions,
	})

export const committeePartyArg = (conditions?: CommitteePartyCondition[]) =>
	effectArg({
		type: CardEffectTarget.CommitteeParty,
		committeePartyConditions: conditions,
	})

export const committeePartyMemberArg = (
	conditions?: CommitteePartyCondition[],
) =>
	effectArg({
		type: CardEffectTarget.CommitteePartyMember,
		committeePartyConditions: conditions,
	})
