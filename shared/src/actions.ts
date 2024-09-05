import { CardEffectArgumentType, GameProgress } from './cards'
import { CompetitionType } from './competitions'
import { GameInfo } from './extra'
import { GameState, GridCellLocation, StandardProjectType } from './game'
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
	InvalidVersion = 'InvalidVersion',
}

export enum JoinError {
	InvalidName = 'InvalidName',
	DuplicateName = 'DuplicateName',
	GameInProgress = 'GameInProgress',
	InvalidSession = 'InvalidSession',
	PlayersLimitReached = 'PlayersLimitReached',
}

export enum SpectateError {
	NotAllowed = 'NotAllowed',
}

export enum MessageType {
	JoinRequest = 1,
	JoinResponse,
	HandshakeRequest,
	HandshakeResponse,
	PlayerReady,
	ServerMessage,
	GameStateUpdate,
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
	PickPreludes,
	ClaimTile,
	StartGame,
	KickPlayer,
	Kicked,
	SpectateRequest,
	SpectateResponse,
	DraftCard,
	PickStarting,
	SolarPhaseTerraform,
	AddCardResource,
	DiscardCards,
	ColonizeColony,
	TradeWithColony,
}

export const handshakeRequest = (version: string) =>
	({
		type: MessageType.HandshakeRequest,
		data: {
			version,
		},
	}) as const

export const handshakeResponse = (error?: HandshakeError, info?: GameInfo) =>
	({
		type: MessageType.HandshakeResponse,
		data: {
			error,
			info,
		},
	}) as const

export const joinRequest = (name?: string, session?: string) =>
	({
		type: MessageType.JoinRequest,
		data: { name, session },
	}) as const

export const joinResponse = (
	error?: JoinError,
	session?: string,
	id?: number,
) =>
	({
		type: MessageType.JoinResponse,
		data: {
			error,
			session,
			id,
		},
	}) as const

export const playerReady = (ready = true) =>
	({ type: MessageType.PlayerReady, data: { ready } }) as const

export const playerPass = (force = false) =>
	({ type: MessageType.PlayerPass, data: { force } }) as const

export const serverMessage = (message: string) =>
	({ type: MessageType.ServerMessage, data: { message } }) as const

export const gameStateUpdate = (data: GameState) =>
	({ type: MessageType.GameStateUpdate, data }) as const

export const pickStarting = (
	corporation: string,
	cards: number[],
	preludes: number[] = [],
) =>
	({
		type: MessageType.PickStarting,
		data: { corporation, cards, preludes },
	}) as const

export const pickCards = (cards: number[]) =>
	({
		type: MessageType.PickCards,
		data: { cards },
	}) as const

export const buyCard = (
	card: string,
	index: number,
	useOre: number,
	useTitan: number,
	useCards: Record<string, number>,
	args: CardEffectArgumentType[][],
) =>
	({
		type: MessageType.BuyCard,
		data: { card, index, args, useOre, useTitan, useCards },
	}) as const

export const sellCard = (card: string, index: number) =>
	({
		type: MessageType.SellCard,
		data: { card, index },
	}) as const

export const playCard = (
	card: string,
	index: number,
	args: CardEffectArgumentType[][],
) =>
	({
		type: MessageType.PlayCard,
		data: { card, index, args },
	}) as const

export const placeTile = (
	x: number,
	y: number,
	location: GridCellLocation | undefined,
) =>
	({
		type: MessageType.PlaceTile,
		data: { x, y, location },
	}) as const

export const claimTile = (
	x: number,
	y: number,
	location: GridCellLocation | undefined,
) =>
	({
		type: MessageType.ClaimTile,
		data: { x, y, location },
	}) as const

export const adminChange = (state: UpdateDeepPartial<GameState>) =>
	({
		type: MessageType.AdminChange,
		data: state,
	}) as const

export const buyStandardProject = (
	project: StandardProjectType,
	cards: number[] = [],
) =>
	({
		type: MessageType.BuyStandardProject,
		data: {
			project,
			cards,
		},
	}) as const

export const buyMilestone = (type: MilestoneType) =>
	({
		type: MessageType.BuyMilestone,
		data: {
			type,
		},
	}) as const

export const sponsorCompetition = (type: CompetitionType) =>
	({
		type: MessageType.SponsorCompetition,
		data: {
			type,
		},
	}) as const

export const pickColor = (index: number) =>
	({
		type: MessageType.PickColor,
		data: {
			index,
		},
	}) as const

export const adminLogin = (password: string) =>
	({
		type: MessageType.AdminLogin,
		data: {
			password,
		},
	}) as const

export const pickPreludes = (cards: number[]) =>
	({
		type: MessageType.PickPreludes,
		data: { cards },
	}) as const

export const startGame = () =>
	({
		type: MessageType.StartGame,
		data: {},
	}) as const

export const kickPlayer = (playerId: number) =>
	({
		type: MessageType.KickPlayer,
		data: { playerId },
	}) as const

export const kicked = () =>
	({
		type: MessageType.Kicked,
	}) as const

export const spectateRequest = () =>
	({
		type: MessageType.SpectateRequest,
	}) as const

export const spectateResponse = (error?: SpectateError) =>
	({
		type: MessageType.SpectateResponse,
		data: {
			error,
		},
	}) as const

export const draftCard = (cards: number[]) =>
	({
		type: MessageType.DraftCard,
		data: { cards },
	}) as const

export const solarPhaseTerraform = (progress: GameProgress) =>
	({
		type: MessageType.SolarPhaseTerraform,
		data: { progress },
	}) as const

export const addCardResource = (cardIndex: number) =>
	({
		type: MessageType.AddCardResource,
		data: { cardIndex },
	}) as const

export const discardCards = (cardIndexes: number[]) =>
	({
		type: MessageType.DiscardCards,
		data: { cardIndexes },
	}) as const

export const colonizeColony = (colonyIndex: number) =>
	({
		type: MessageType.ColonizeColony,
		data: { colonyIndex },
	}) as const

export const tradeWithColony = (colonyIndex: number) =>
	({
		type: MessageType.TradeWithColony,
		data: { colonyIndex },
	}) as const

export type GameMessage =
	| ReturnType<typeof joinRequest>
	| ReturnType<typeof joinResponse>
	| ReturnType<typeof handshakeRequest>
	| ReturnType<typeof handshakeResponse>
	| ReturnType<typeof playerReady>
	| ReturnType<typeof playerPass>
	| ReturnType<typeof serverMessage>
	| ReturnType<typeof gameStateUpdate>
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
	| ReturnType<typeof claimTile>
	| ReturnType<typeof startGame>
	| ReturnType<typeof kickPlayer>
	| ReturnType<typeof kicked>
	| ReturnType<typeof spectateRequest>
	| ReturnType<typeof spectateResponse>
	| ReturnType<typeof draftCard>
	| ReturnType<typeof pickStarting>
	| ReturnType<typeof solarPhaseTerraform>
	| ReturnType<typeof addCardResource>
	| ReturnType<typeof discardCards>
	| ReturnType<typeof colonizeColony>
	| ReturnType<typeof tradeWithColony>
