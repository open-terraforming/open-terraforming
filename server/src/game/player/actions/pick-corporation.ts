import {
	GameStateValue,
	pickCorporation,
	PlayerStateValue
} from '@shared/index'
import { PlayerBaseAction } from '../action'
import { PlayerActionType } from '@shared/player-actions'
import { CardsLookupApi, CardType } from '@shared/cards'
import { f } from '@shared/utils'
import { emptyCardState } from '@shared/cards/utils'

type Args = ReturnType<typeof pickCorporation>['data']

export class PickCorporationAction extends PlayerBaseAction<Args> {
	states = [PlayerStateValue.Picking]
	gameStates = [GameStateValue.Starting]

	perform({ code }: Args) {
		const top = this.pendingAction

		if (top?.type !== PlayerActionType.PickCorporation) {
			throw new Error('You are not picking corporations right now')
		}

		if (!top.cards.includes(code)) {
			throw new Error(`This corporation wasn't in your options`)
		}

		const corp = CardsLookupApi.get(code)

		if (!corp || corp.type !== CardType.Corporation) {
			throw new Error(`Unknown corporation ${code}`)
		}

		this.logger.log(f('Picked corporation {0}', code))

		const card = emptyCardState(corp.code, this.player.usedCards.length)
		this.player.usedCards.push(card)
		this.player.corporation = card.code

		this.runCardEffects(
			corp.playEffects,
			{
				card,
				game: this.game,
				player: this.player
			},
			[]
		)

		this.parent.onCardPlayed.emit({
			card: corp,
			cardIndex: -1,
			player: this.parent
		})

		this.popAction()
	}
}
