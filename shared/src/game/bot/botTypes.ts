export type BotAction = {
	description: string
	score: number
	perform: () => void
}
