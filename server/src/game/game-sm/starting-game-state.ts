import { BaseGameState } from './base-game-state'
import { GameStateValue, PlayerStateValue } from '@shared/index'
import { shuffle } from '@shared/utils'
import { PlayerColors } from '@shared/player-colors'
import { randomPlayerColor } from '@/utils/colors'
import { CardsLookupApi, CardSpecial, CardType } from '@shared/cards'

export class StartingGameState extends BaseGameState {
	name = GameStateValue.Starting

	onEnter() {
		this.logger.log(`Game starting`)

		// Initial game progress
		this.state.started = new Date().toISOString()
		this.state.oxygen = this.state.map.initialOxygen
		this.state.oceans = this.state.map.initialOceans
		this.state.temperature = this.state.map.initialTemperature

		// Pick first starting player
		this.state.startingPlayer = Math.round(
			Math.random() * (this.state.players.length - 1)
		)

		// Assign random colors to players
		const usedColors = this.state.players.map(p => p.color)

		const availableColors = shuffle(
			PlayerColors.filter(c => !usedColors.includes(c))
		)

		this.state.players
			.filter(p => !p.color || p.color === '')
			.forEach(p => {
				p.color =
					availableColors.length > 0
						? (availableColors.pop() as string)
						: randomPlayerColor(
								this.state.players.map(p => p.color).filter(c => c !== '')
						  )
			})

		// Create card pool
		let cards = Object.values(CardsLookupApi.data())

		// Remove Prelude if not desired
		if (!this.state.prelude) {
			cards = cards.filter(c => !c.special.includes(CardSpecial.Prelude))
		}

		// Pick cards based on the game mode
		if (this.game.mode.filterCards) {
			cards = this.game.mode.filterCards(cards)
		}

		// Pick corporations
		this.state.corporations = shuffle(
			cards.filter(c => c.type === CardType.Corporation).map(c => c.code)
		)

		// Pick preludes
		this.state.preludeCards = this.state.prelude
			? shuffle(cards.filter(c => c.type === CardType.Prelude).map(c => c.code))
			: []

		// Pick projects
		this.state.cards = shuffle(
			cards
				.filter(
					c => c.type !== CardType.Corporation && c.type !== CardType.Prelude
				)
				.map(c => c.code)
		)

		// Start picking corporations or whatever the mode desires
		if (this.game.mode.onGameStart) {
			this.game.mode.onGameStart(this.state)
		}
	}

	transition() {
		if (this.game.all(PlayerStateValue.Waiting)) {
			return GameStateValue.GenerationInProgress
		}
	}
}
