import { CardSymbol } from '@shared/cards'
import { GameState, GridCell, PlayerState } from '@shared/index'

/**
 * POLICIES:
 *  - gain 1 steel when placing tile on MARS
 *  - you can pay $10 to increase your heat and energy production by 1, may be used as many times as you want
 *  - pay $10 to draw 3 cards, can only be used once per generation per player
 *  - when you gain TR, you loose $3 - if you don't have $3, your TR won't be raised
 *  - titanium is worth $1 more
 *  - gain $4 every time you place a greenery tile
 */

export interface CommitteeParty {
	code: string
	bonus: {
		symbols: CardSymbol[]
		apply: (game: GameState) => void
	}
	policy: {
		active: CommitteePartyActiveAction[]
		passive: CommitteePartyPassiveAction[]
	}
}

interface CommitteePartyActiveActionCallbackContext {
	player: PlayerState
	game: GameState
}

interface CommitteePartyActiveAction {
	symbols: CardSymbol[]
	description: string
	oncePerGeneration?: boolean
	condition?: (ctx: CommitteePartyActiveActionCallbackContext) => boolean
	action: (ctx: CommitteePartyActiveActionCallbackContext) => void
}

interface CommitteePartyPassiveAction {
	symbols: CardSymbol[]
	description: string
	/** Called when party becomes ruling */
	onActivate?: (ctx: { game: GameState }) => void
	/** Called when party stops being ruling */
	onDeactivate?: (ctx: { game: GameState }) => void
	onTilePlaced?: (ctx: {
		game: GameState
		cell: GridCell
		player: PlayerState
	}) => void
	onPlayerRatingChanged?: (ctx: {
		game: GameState
		player: PlayerState
	}) => void
}

export const committeeParty = (party: CommitteeParty) => party
