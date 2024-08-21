import { CardsLookupApi, CardType } from '@shared/cards'
import { emptyCardState } from '@shared/cards/utils'
import { GameStateValue, pickStarting, PlayerStateValue } from '@shared/index'
import { PlayerActionType } from '@shared/player-actions'
import { f } from '@shared/utils'
import { simulateCardEffects } from '@shared/utils/simulate-card-effects'
import { PlayerBaseAction } from '../action'

type Args = ReturnType<typeof pickStarting>['data']

export class PickStartingAction extends PlayerBaseAction<Args> {
	states = [PlayerStateValue.Picking]
	gameStates = [GameStateValue.Starting]

	perform({ corporation, cards, preludes }: Args) {
		const top = this.pendingAction

		if (top?.type !== PlayerActionType.PickStarting) {
			throw new Error('You are not picking corporations right now')
		}

		if (!top.corporations.includes(corporation)) {
			throw new Error(`This corporation wasn't in your options`)
		}

		const corp = CardsLookupApi.get(corporation)

		if (!corp || corp.type !== CardType.Corporation) {
			throw new Error(`Unknown corporation ${corporation}`)
		}

		if (new Set(cards).size !== cards.length) {
			throw new Error('You cant pick one card twice')
		}

		if (cards.find((c) => c >= top.cards.length || c < 0)) {
			throw new Error('Invalid list of cards to pick')
		}

		if (new Set(preludes).size !== preludes.length) {
			throw new Error('You cant pick one card twice')
		}

		if (preludes.find((c) => c >= top.preludes.length || c < 0)) {
			throw new Error('Invalid list of cards to pick')
		}

		if (top.preludesLimit > 0) {
			if (preludes.length !== top.preludesLimit) {
				throw new Error(`You have to pick ${top.preludesLimit} cards`)
			}
		}

		// We have to see what effects corporation has to properly evaluate if player can afford projects and preludes
		const { player: simulated } = simulateCardEffects(
			corporation,
			corp.playEffects,
		)

		const cost = cards.length * this.game.cardPrice

		if (cost > simulated.money) {
			throw new Error("You don't have money for that")
		}

		// Update simulated player as if he bought the cards
		simulated.money -= cost

		// Preludes can actually be unplayable under certain conditions
		preludes
			.map((c) => CardsLookupApi.get(top.preludes[c]))
			.forEach((c) =>
				this.checkCardConditions(
					c,
					{
						card: emptyCardState(c.code),
						game: this.game,
						player: simulated,
					},
					[],
				),
			)

		this.pickCorporation(corporation)
		this.pickCards(top.cards, cards)
		this.pickPreludes(top.preludes, preludes)

		this.popAction()
	}

	pickPreludes(choices: string[], picked: number[]) {
		const pickedCards = picked.map((c) => choices[c])

		this.logger.log(f('Picked preludes: {0}', pickedCards.join(', ')))

		// Put preludes into "played" cards without playing them, the preludes are then later played in "Prelude" game state
		const usedCards = picked.map((c, i) =>
			emptyCardState(choices[c], this.player.usedCards.length + i),
		)

		this.player.usedCards = [...this.player.usedCards, ...usedCards]

		// Put the rest into discarded pile
		this.game.preludeDiscarded = [
			...this.game.preludeDiscarded,
			...choices.filter((_c, i) => !picked.includes(i)),
		]
	}

	pickCards(choices: string[], picked: number[]) {
		const pickedCards = picked.map((c) => choices[c])

		this.logger.log(f('Picked cards: {0}', pickedCards.join(', ')))

		// Remove money
		this.player.money -= picked.length * this.game.cardPrice

		// Put cards into player hands
		this.player.cards = [...this.player.cards, ...pickedCards]

		// Put the rest to discarded pile
		this.game.discarded.push(...choices.filter((_c, i) => !picked.includes(i)))
	}

	pickCorporation(corporation: string) {
		this.logger.log(f('Picked corporation {0}', corporation))

		const corp = CardsLookupApi.get(corporation)
		const card = emptyCardState(corp.code, this.player.usedCards.length)
		this.player.usedCards.push(card)
		this.player.corporation = card.code

		this.runCardEffects(
			corp.playEffects,
			{
				card,
				game: this.game,
				player: this.player,
			},
			[],
		)

		this.parent.onCardPlayed.emit({
			card: corp,
			cardIndex: -1,
			player: this.parent,
		})
	}
}
