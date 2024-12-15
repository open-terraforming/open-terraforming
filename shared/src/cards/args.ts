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

export enum CardEffectArgumentType {
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
	TType extends CardEffectArgumentType = CardEffectArgumentType,
> = CardEffectArgumentBase<TType>

export type AnyCardEffectArgument = CardEffectArgument<CardEffectArgumentType>

export interface CardEffectArgumentBase<TType extends CardEffectArgumentType> {
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
	[CardEffectArgumentType.Player]: number
	[CardEffectArgumentType.PlayerResource]: number
	[CardEffectArgumentType.ResourceCount]: number
	[CardEffectArgumentType.ResourceType]: Resource
	[CardEffectArgumentType.ProductionCount]: number
	[CardEffectArgumentType.Card]: number
	[CardEffectArgumentType.PlayerCardResource]: [
		player: number,
		cardIndex: number,
	]
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[CardEffectArgumentType.EffectChoice]: [choice: number, choiceParams: any[]]
	[CardEffectArgumentType.Tile]: [
		x: number,
		y: number,
		location: GridCellLocation | null,
	]
	[CardEffectArgumentType.CardResourceCount]: number
	[CardEffectArgumentType.CommitteeParty]: string
	[CardEffectArgumentType.CommitteePartyMember]: [
		partyCode: string,
		memberPlayerId: number | null,
	]
}

export const effectArg = <TType extends CardEffectArgumentType>(
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
		type: CardEffectArgumentType.EffectChoice,
		effects,
	})

export const cardArg = (
	conditions: CardCondition[] = [],
	descriptionPrefix?: string,
	descriptionPostfix?: string,
	extra?: Partial<CardEffectArgument<CardEffectArgumentType.Card>>,
) =>
	effectArg({
		type: CardEffectArgumentType.Card,
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
		type: CardEffectArgumentType.Tile,
		descriptionPrefix,
		descriptionPostfix,
		tilePlacementState: state,
	})

export const playerCardArg = (
	conditions: CardCondition[] = [],
	amount = 0,
	extra?: Partial<
		CardEffectArgument<CardEffectArgumentType.PlayerCardResource>
	>,
) =>
	effectArg({
		type: CardEffectArgumentType.PlayerCardResource,
		cardConditions: [...conditions, unprotectedCard()],
		amount,
		...extra,
	})

export const resourceTypeArg = (resourceConditions: ResourceCondition[] = []) =>
	effectArg({
		type: CardEffectArgumentType.ResourceType,
		resourceConditions,
	})

export const committeePartyArg = (conditions?: CommitteePartyCondition[]) =>
	effectArg({
		type: CardEffectArgumentType.CommitteeParty,
		committeePartyConditions: conditions,
	})

export const committeePartyMemberArg = (
	conditions?: CommitteePartyCondition[],
) =>
	effectArg({
		type: CardEffectArgumentType.CommitteePartyMember,
		committeePartyConditions: conditions,
	})
