import { GameState } from '.'
import { CardEffectArgumentType } from './cards'
import { StandardProjectType } from './game'
import { MilestoneType } from './milestones'
import { CompetitionType } from './competitions'

export enum HandshakeError {
	InvalidVersion = 'InvalidVersion',
	InvalidName = 'InvalidName',
	GameInProgress = 'GameInProgress',
	InvalidSession = 'InvalidSession',
}

export enum MessageType {
	HandshakeRequest,
	HandshakeResponse,
	PlayerReady,
	ServerMessage,
	GameStateUpdate,
	PickCorporation,
	PickCards,
	BuyCard,
	SellCard,
	PlayCard,
	SponsorCompetition,
	BuyMilestone,
	BuyStandardProject,
	PlayerPass,
	PlaceTile,
	AdminChange,
	AdminLogin,
}

/**
 * Deep partial, where Arrays can also be objects with numeric indexes (updating only specific array key)
 */
export type UpdateDeepPartial<T> = {
	[K in keyof T]?: T[K] extends (infer U)[]
		? { [key: number]: UpdateDeepPartial<U> } | U[]
		: T[K] extends object
		? UpdateDeepPartial<T[K]>
		: T[K] extends (infer U)[]
		? { [key: string]: U }
		: T[K]
}

export interface HandshakeRequest {
	type: typeof MessageType.HandshakeRequest
	data: {
		name: string
		version: string
		session?: string
	}
}

export interface HandshakeResponse {
	type: typeof MessageType.HandshakeResponse
	data: {
		error?: HandshakeError
		session?: string
		id?: number
	}
}

export interface PlayerReady {
	type: typeof MessageType.PlayerReady
	data: {
		ready: boolean
	}
}

export interface ServerMessage {
	type: typeof MessageType.ServerMessage
	data: {
		message: string
	}
}

export interface GameStateUpdate {
	type: typeof MessageType.GameStateUpdate
	data: GameState
}

export interface PickCorporation {
	type: typeof MessageType.PickCorporation
	data: {
		code: string
	}
}

export interface PickCards {
	type: typeof MessageType.PickCards
	data: {
		cards: number[]
	}
}

export interface BuyCard {
	type: typeof MessageType.BuyCard
	data: {
		card: string
		index: number
		useOre: number
		useTitan: number
		args: CardEffectArgumentType[][]
	}
}

export interface SellCard {
	type: typeof MessageType.SellCard
	data: {
		card: string
		index: number
	}
}

export interface PlayCard {
	type: typeof MessageType.PlayCard
	data: {
		card: string
		index: number
		args: CardEffectArgumentType[][]
	}
}

export interface PlayerPass {
	type: typeof MessageType.PlayerPass
	data: {
		force: boolean
	}
}

export interface PlaceTile {
	type: typeof MessageType.PlaceTile
	data: {
		x: number
		y: number
	}
}

export interface AdminChange {
	type: typeof MessageType.AdminChange
	data: UpdateDeepPartial<GameState>
}

export interface BuyStandardProject {
	type: typeof MessageType.BuyStandardProject
	data: {
		project: StandardProjectType
		cards: number[]
	}
}

export interface BuyMilestone {
	type: typeof MessageType.BuyMilestone
	data: {
		type: MilestoneType
	}
}

export interface SponsorCompetition {
	type: typeof MessageType.SponsorCompetition
	data: {
		type: CompetitionType
	}
}

export interface AdminLogin {
	type: typeof MessageType.AdminLogin
	data: {
		password: string
	}
}

export type GameMessage =
	| HandshakeRequest
	| HandshakeResponse
	| PlayerReady
	| ServerMessage
	| GameStateUpdate
	| PickCorporation
	| PickCards
	| BuyCard
	| SellCard
	| PlayCard
	| PlayerPass
	| PlaceTile
	| AdminChange
	| BuyStandardProject
	| BuyMilestone
	| SponsorCompetition
	| AdminLogin
