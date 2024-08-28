export enum RealtimeEventType {
	Auth = 1,
	MouseMove,
	Message,
	Emotion,
}

export enum EmotionType {
	Anger = 1,
	Happy,
	ThumbUp,
}

export const eventsAuth = (session: string) =>
	({
		type: RealtimeEventType.Auth,
		session,
	}) as const

export const mouseMoveEvent = (x: number, y: number) =>
	({
		type: RealtimeEventType.MouseMove,
		x,
		y,
	}) as const

export const messageEvent = (text: string) =>
	({
		type: RealtimeEventType.Message,
		text,
	}) as const

export const emotionEvent = (emotion: EmotionType) =>
	({
		type: RealtimeEventType.Message,
		emotion,
	}) as const

export type RealtimeEventEmit =
	| ReturnType<typeof eventsAuth>
	| ReturnType<typeof mouseMoveEvent>
	| ReturnType<typeof messageEvent>
	| ReturnType<typeof emotionEvent>

export type RealtimeEvent = { playerId: number } & RealtimeEventEmit
