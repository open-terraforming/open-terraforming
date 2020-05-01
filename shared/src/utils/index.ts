import { COMPETITIONS_PRICES, MILESTONE_PRICE } from '../constants'
import {
	GameState,
	GridCell,
	PlayerState,
	PlayerStateValue,
	UsedCardState
} from '../game'
import { PlayerAction, PlayerActionType } from '../player-actions'
import { range, shuffle, TileCollection, CardsCollection } from './collections'
import { CardsLookupApi } from '../cards/lookup'
import { emptyCardState } from '../cards/utils'

export const allCells = (game: GameState) => {
	return game.map.grid.reduce((acc, c) => [...acc, ...c], [] as GridCell[])
}

export const adjacentCells = (game: GameState, x: number, y: number) => {
	const g = game.map.grid
	const w = game.map.width
	const h = game.map.height

	return [
		...(y > 0
			? [
					y % 2 === 0 && x > 0 && g[x - 1][y - 1],
					g[x][y - 1],
					y % 2 === 1 && x < w - 1 && g[x + 1][y - 1]
			  ]
			: []),
		x > 0 && g[x - 1][y],
		x < w - 1 && g[x + 1][y],
		...(y < h - 1
			? [
					y % 2 === 0 && x > 0 && g[x - 1][y + 1],
					g[x][y + 1],
					y % 2 === 1 && x < w - 1 && g[x + 1][y + 1]
			  ]
			: [])
	].filter(c => c && c.enabled) as GridCell[]
}

export const ucFirst = (value: string) =>
	value.charAt(0).toUpperCase() + value.slice(1)

export const drawPreludeCards = (game: GameState, count: number) =>
	range(0, count).map(() => drawPreludeCard(game))

export const drawPreludeCard = (game: GameState) => {
	if (game.preludeCards.length === 0) {
		game.preludeCards = shuffle(game.preludeDiscarded.slice(0))
		game.preludeDiscarded = []
	}

	if (game.preludeCards.length === 0) {
		throw new Error(`There are no more prelude cards.`)
	}

	return game.preludeCards.pop() as string
}

export const drawCard = (game: GameState) => {
	if (game.cards.length === 0) {
		game.cards = shuffle(game.discarded.slice(0))
		game.discarded = []
	}

	if (game.cards.length === 0) {
		const played = game.players.reduce(
			(acc, p) => acc + p.cards.length + p.usedCards.length,
			0
		)

		throw new Error(
			`There are no more cards. Players have ${played} in their hands`
		)
	}

	return game.cards.pop() as string
}

export const drawCards = (game: GameState, count: number) =>
	range(0, count).map(() => drawCard(game))

export const drawCorporation = (game: GameState) => {
	if (game.corporations.length === 0) {
		game.corporations = shuffle(game.corporationsDiscarded.slice(0))
		game.corporationsDiscarded = []
	}

	if (game.corporations.length === 0) {
		throw new Error(`There are no more corporations to pick from`)
	}

	return game.corporations.pop() as string
}

export const drawCorporations = (game: GameState, count: number) =>
	range(0, count).map(() => drawCorporation(game))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const f = (s: string, ...args: any[]) =>
	args.reduce(
		(s, a, i) =>
			s.replace(
				`{${i}}`,
				typeof a === 'object' && typeof a.toString === 'function'
					? a.toString()
					: a
			),
		s
	)

/**
 * Removes control characters from input string
 * @param str
 */
export const sanitize = (str?: string) =>
	str ? str.replace(/[\x00-\x1F\x7F-\x9F]/g, '') : str

export const milestonePrice = () => {
	return MILESTONE_PRICE
}

export const competitionPrice = (game: GameState) => {
	return COMPETITIONS_PRICES[game.competitions.length]
}

export const pushPendingAction = (
	player: PlayerState,
	action: PlayerAction
) => {
	player.pendingActions.push(action)
}

const allowedActions: Record<number, PlayerActionType[] | undefined> = {
	[PlayerStateValue.Picking]: [
		PlayerActionType.PickCorporation,
		PlayerActionType.PickCards,
		PlayerActionType.PickPreludes
	],
	[PlayerStateValue.EndingTiles]: [PlayerActionType.PlaceTile],
	[PlayerStateValue.Playing]: []
}

export const pendingActions = (player: PlayerState) => {
	const allowed = allowedActions[player.state]

	return allowed
		? allowed.length === 0
			? player.pendingActions
			: player.pendingActions.filter(p => allowed.includes(p.type))
		: []
}

export const tiles = (list: GridCell[]) => new TileCollection(list)
export const adjTilesList = (game: GameState, x: number, y: number) =>
	new TileCollection(adjacentCells(game, x, y))

export * from './collections'
