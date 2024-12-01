import { addDelegate } from '@shared/expansions/turmoil/utils/addDelegate'
import { computeScore } from './computeScore'
import { ScoringContext } from './types'
import { copyGame } from './utils'

export const addDelegateToPartyScore = (
	ctx: ScoringContext,
	partyCode: string,
) => {
	const { gameCopy, playerCopy } = copyGame(ctx.game, ctx.player)

	const lobbyIndex = gameCopy.committee.lobby.findIndex(
		(delegate) => delegate.id === playerCopy.id,
	)

	if (lobbyIndex < 0) {
		const reserveIndex = gameCopy.committee.reserve.findIndex(
			(delegate) => delegate?.id === playerCopy.id,
		)

		if (playerCopy.money < 5) {
			return -1
		}

		playerCopy.money -= 5
		gameCopy.committee.reserve.splice(reserveIndex, 1)
	} else {
		gameCopy.committee.lobby.splice(lobbyIndex, 1)
	}

	addDelegate(gameCopy, partyCode, { id: ctx.player.id })

	return computeScore(ctx.scoring, gameCopy, playerCopy)
}
