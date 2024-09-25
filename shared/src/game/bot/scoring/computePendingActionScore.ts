import { GameState, PlayerState } from '@shared/index'
import { canPlace } from '@shared/placements'
import { PlayerAction, PlayerActionType } from '@shared/player-actions'
import { allCells } from '@shared/utils'
import { AiScoringCoefficients } from './defaultScoringCoefficients'
import { placeTileScore } from './place-tile-score'
import { pickBestScore } from './utils'

export const computePendingActionScore = (
	s: AiScoringCoefficients,
	g: GameState,
	p: PlayerState,
	a: PlayerAction,
) => {
	switch (a.type) {
		case PlayerActionType.ClaimTile:
			return s.pendingActions.claimTile
		case PlayerActionType.PickCards:
			return a.free
				? a.limit * s.pendingActions.pickCards.whenFreeLimitCount
				: s.pendingActions.pickCards.whenNotFree
		case PlayerActionType.PlaceTile:
			return (
				pickBestScore(
					allCells(g).filter((c) => canPlace(g, p, c, a.state)),
					(c) => placeTileScore({ scoring: s, player: p, game: g }, a.state, c),
				) * s.pendingActions.placeTile
			)
		case PlayerActionType.BuildColony:
			return a.data.allowMoreColoniesPerColony
				? s.pendingActions.buildColony.whenMoreColoniesPerColony
				: s.pendingActions.buildColony.whenLimited
		case PlayerActionType.AddCardResource:
			return a.data.amount * s.pendingActions.addCardResource
		case PlayerActionType.ChangeColonyStep:
			return s.pendingActions.changeColonyStep
		case PlayerActionType.TradeWithColony:
			return s.pendingActions.tradeWithColony
		case PlayerActionType.SponsorCompetition:
			return s.pendingActions.sponsorCompetition
		case PlayerActionType.PlayCard:
			return s.pendingActions.playCard
		case PlayerActionType.DraftCard:
			return a.limit * s.pendingActions.draftCard
		default:
			return 0
	}
}
