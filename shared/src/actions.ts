import { CardEffectArgumentType } from './cards'
import { CompetitionType } from './competitions'
import { GameInfo } from './extra'
import { GameState, StandardProjectType } from './game'
import { MilestoneType } from './milestones'

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

export enum HandshakeError {
	InvalidVersion = 'InvalidVersion'
}

export enum JoinError {
	InvalidName = 'InvalidName',
	DuplicateName = 'DuplicateName',
	GameInProgress = 'GameInProgress',
	InvalidSession = 'InvalidSession'
}

export enum MessageType {
	JoinRequest = 1,
	JoinResponse,
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
	PickColor,
	PickPreludes
}

export const handshakeRequest = (version: string) =>
	({
		type: MessageType.HandshakeRequest,
		data: {
			version
		}
	} as const)

export const handshakeResponse = (error?: HandshakeError, info?: GameInfo) =>
	({
		type: MessageType.HandshakeResponse,
		data: {
			error,
			info
		}
	} as const)

export const joinRequest = (name?: string, session?: string) =>
	({
		type: MessageType.JoinRequest,
		data: { name, session }
	} as const)

export const joinResponse = (
	error?: JoinError,
	session?: string,
	id?: number
) =>
	({
		type: MessageType.JoinResponse,
		data: {
			error,
			session,
			id
		}
	} as const)

export const playerReady = (ready = true) =>
	({ type: MessageType.PlayerReady, data: { ready } } as const)

export const playerPass = (force = false) =>
	({ type: MessageType.PlayerPass, data: { force } } as const)

export const serverMessage = (message: string) =>
	({ type: MessageType.ServerMessage, data: { message } } as const)

export const gameStateUpdate = (data: GameState) =>
	({ type: MessageType.GameStateUpdate, data } as const)

export const pickCorporation = (code: string) =>
	({
		type: MessageType.PickCorporation,
		data: { code }
	} as const)

export const pickCards = (cards: number[]) =>
	({
		type: MessageType.PickCards,
		data: { cards }
	} as const)

export const buyCard = (
	card: string,
	index: number,
	useOre: number,
	useTitan: number,
	args: CardEffectArgumentType[][]
) =>
	({
		type: MessageType.BuyCard,
		data: { card, index, args, useOre, useTitan }
	} as const)

export const sellCard = (card: string, index: number) =>
	({
		type: MessageType.SellCard,
		data: { card, index }
	} as const)

export const playCard = (
	card: string,
	index: number,
	args: CardEffectArgumentType[][]
) =>
	({
		type: MessageType.PlayCard,
		data: { card, index, args }
	} as const)

export const placeTile = (x: number, y: number) =>
	({
		type: MessageType.PlaceTile,
		data: { x, y }
	} as const)

export const adminChange = (state: UpdateDeepPartial<GameState>) =>
	({
		type: MessageType.AdminChange,
		data: state
	} as const)

export const buyStandardProject = (
	project: StandardProjectType,
	cards: number[] = []
) =>
	({
		type: MessageType.BuyStandardProject,
		data: {
			project,
			cards
		}
	} as const)

export const buyMilestone = (type: MilestoneType) =>
	({
		type: MessageType.BuyMilestone,
		data: {
			type
		}
	} as const)

export const sponsorCompetition = (type: CompetitionType) =>
	({
		type: MessageType.SponsorCompetition,
		data: {
			type
		}
	} as const)

export const pickColor = (index: number) =>
	({
		type: MessageType.PickColor,
		data: {
			index
		}
	} as const)

export const adminLogin = (password: string) =>
	({
		type: MessageType.AdminLogin,
		data: {
			password
		}
	} as const)

export const pickPreludes = (cards: number[]) =>
	({
		type: MessageType.PickPreludes,
		data: { cards }
	} as const)

export type GameMessage =
	| ReturnType<typeof joinRequest>
	| ReturnType<typeof joinResponse>
	| ReturnType<typeof handshakeRequest>
	| ReturnType<typeof handshakeResponse>
	| ReturnType<typeof playerReady>
	| ReturnType<typeof playerPass>
	| ReturnType<typeof serverMessage>
	| ReturnType<typeof gameStateUpdate>
	| ReturnType<typeof pickCorporation>
	| ReturnType<typeof pickCards>
	| ReturnType<typeof buyCard>
	| ReturnType<typeof sellCard>
	| ReturnType<typeof playCard>
	| ReturnType<typeof placeTile>
	| ReturnType<typeof adminChange>
	| ReturnType<typeof buyStandardProject>
	| ReturnType<typeof buyMilestone>
	| ReturnType<typeof sponsorCompetition>
	| ReturnType<typeof pickColor>
	| ReturnType<typeof adminLogin>
	| ReturnType<typeof pickPreludes>
