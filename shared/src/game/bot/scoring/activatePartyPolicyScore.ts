import { getCommitteeParty } from '@shared/utils'
import { computeScore } from './computeScore'
import { ScoringContext } from './types'
import { copyGame } from './utils'

export const activatePartyPolicyScore = (
	ctx: ScoringContext,
	index: number,
) => {
	const { gameCopy, playerCopy } = copyGame(ctx.game, ctx.player)

	if (!gameCopy.committee.rulingParty) {
		return -1
	}

	const rulingParty = getCommitteeParty(gameCopy.committee.rulingParty)
	const activePolicy = rulingParty.policy.active[index]

	if (!activePolicy) {
		return -1
	}

	const condition = activePolicy.condition

	if (condition && !condition({ game: gameCopy, player: playerCopy })) {
		return -1
	}

	activePolicy.action({ game: gameCopy, player: playerCopy })

	return computeScore(ctx.scoring, gameCopy, playerCopy)
}
