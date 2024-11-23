import { CardSymbol } from '@shared/cards'
import { GameState, GridCell, PlayerState } from '@shared/index'

export interface CommitteeParty {
	code: string
	bonus: {
		symbols: CardSymbol[]
		description: string
		apply: (game: GameState) => void
	}
	policy: {
		// NOTE: The system currently only supports one activate policy at a time
		active: [CommitteePartyActiveAction] | []
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
