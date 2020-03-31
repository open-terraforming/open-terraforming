import {
	MessageType,
	HandshakeResponse,
	HandshakeRequest,
	HandshakeError,
	PlayerReady,
	ServerMessage,
	GameStateUpdate,
	PickCorporation,
	PickCards,
	BuyCard,
	SellCard,
	PlayCard,
	PlayerPass,
	PlaceTile,
} from './messages'
import { GameState } from './game'
import { CardEffectArgumentType } from './cards'

export const handshakeRequest = (
	version: string,
	name: string,
	session?: string
) =>
	({
		type: MessageType.HandshakeRequest,
		data: {
			version,
			name,
			session,
		},
	} as HandshakeRequest)

export const handshakeResponse = (
	error?: HandshakeError,
	session?: string,
	id?: number
) =>
	({
		type: MessageType.HandshakeResponse,
		data: {
			error,
			session,
			id,
		},
	} as HandshakeResponse)

export const playerReady = (ready = true) =>
	({ type: MessageType.PlayerReady, data: { ready } } as PlayerReady)

export const playerPass = (force = false) =>
	({ type: MessageType.PlayerPass, data: { force } } as PlayerPass)

export const serverMessage = (message: string) =>
	({ type: MessageType.ServerMessage, data: { message } } as ServerMessage)

export const gameStateUpdate = (data: GameState) =>
	({ type: MessageType.GameStateUpdate, data } as GameStateUpdate)

export const pickCorporation = (code: string) =>
	({
		type: MessageType.PickCorporation,
		data: { code },
	} as PickCorporation)

export const pickCards = (cards: number[]) =>
	({
		type: MessageType.PickCards,
		data: { cards },
	} as PickCards)

export const buyCard = (
	card: string,
	index: number,
	useOre: number,
	useTitan: number,
	args: CardEffectArgumentType[][]
) =>
	({
		type: MessageType.BuyCard,
		data: { card, index, args, useOre, useTitan },
	} as BuyCard)

export const sellCard = (card: string, index: number) =>
	({
		type: MessageType.SellCard,
		data: { card, index },
	} as SellCard)

export const playCard = (
	card: string,
	index: number,
	args: CardEffectArgumentType[][]
) =>
	({
		type: MessageType.PlayCard,
		data: { card, index, args },
	} as PlayCard)

export const placeTile = (x: number, y: number) =>
	({
		type: MessageType.PlaceTile,
		data: { x, y },
	} as PlaceTile)
