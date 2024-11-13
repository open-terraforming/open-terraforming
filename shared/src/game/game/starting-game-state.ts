import { Card, CardType } from '@shared/cards'
import { Expansions } from '@shared/expansions'
import { GameStateValue, PlayerStateValue } from '@shared/index'
import { PlayerColors } from '@shared/player-colors'
import { shuffle } from '@shared/utils'
import { BaseGameState } from './base-game-state'
import { randomPlayerColor } from '@shared/utils/colors'
import { ExpansionType } from '@shared/expansions/types'
import { ColoniesLookupApi } from '@shared/ColoniesLookupApi'
import { hasExpansion } from '@shared/utils/hasExpansion'
import { initialColonyState } from '@shared/expansions/colonies/states'
import { deduplicate } from '@shared/utils/deduplicate'
import { Cards } from '@shared/cards/list'

export class StartingGameState extends BaseGameState {
	name = GameStateValue.Starting

	onEnter() {
		this.logger.log(`Game starting`)

		if (deduplicate(Cards.map((c) => c.code)).length !== Cards.length) {
			this.logger.error('Duplicate cards in Cards array!')
		}

		// Initial game progress
		this.state.started = new Date().toISOString()
		this.state.oxygen = this.state.map.initialOxygen
		this.state.oceans = this.state.map.initialOceans
		this.state.temperature = this.state.map.initialTemperature

		// Pick first starting player
		this.state.startingPlayer = Math.round(
			Math.random() * (this.state.players.length - 1),
		)

		// Assign random colors to players
		const usedColors = this.state.players.map((p) => p.color)

		const availableColors = shuffle(
			PlayerColors.filter((c) => !usedColors.includes(c)),
		)

		this.state.players
			.filter((p) => !p.color || p.color === '')
			.forEach((p) => {
				p.color =
					availableColors.length > 0
						? (availableColors.pop() as string)
						: randomPlayerColor(
								this.state.players.map((p) => p.color).filter((c) => c !== ''),
							)
			})

		// Create card pool
		let cards = [] as Card[]

		this.state.expansions.forEach((e) => {
			cards = cards.concat(Expansions[e].getCards(this.state))

			if (deduplicate(cards).length !== cards.length) {
				this.logger.error(
					'Duplicate cards found after adding',
					ExpansionType[e],
				)
			}
		})

		// Pick cards based on the game mode
		if (this.game.mode.filterCards) {
			cards = this.game.mode.filterCards(cards)
		}

		if (deduplicate(cards).length !== cards.length) {
			this.logger.error('Duplicate cards found after filterCards')
		}

		// Pick corporations
		this.state.corporations = shuffle(
			cards.filter((c) => c.type === CardType.Corporation).map((c) => c.code),
		)

		// Pick projects
		this.state.cards = shuffle(
			cards
				.filter(
					(c) => c.type !== CardType.Corporation && c.type !== CardType.Prelude,
				)
				.map((c) => c.code),
		)

		// Initialize expansions
		this.state.expansions.forEach((e) => {
			Expansions[e].initialize(this.state)

			if (deduplicate(this.state.cards).length !== this.state.cards.length) {
				this.logger.error(
					'Duplicate cards found after initializing',
					ExpansionType[e],
				)
			}
		})

		// Initialize colonies if the expansion is enabled
		if (hasExpansion(this.game.state, ExpansionType.Colonies)) {
			const colonyCount =
				this.game.state.players.length <= 2
					? this.game.state.players.length + 3
					: this.game.state.players.length + 2

			this.game.state.colonies = shuffle(this.game.state.colonyCards.slice())
				.slice(0, colonyCount)
				.map((code) => initialColonyState(ColoniesLookupApi.get(code)))
		}

		if (deduplicate(this.state.cards).length !== this.state.cards.length) {
			this.logger.error('Duplicate cards found after initialization')
		}

		// Start picking corporations or whatever the mode desires
		if (this.game.mode.onGameStart) {
			this.game.mode.onGameStart(this.state)
		}

		if (deduplicate(this.state.cards).length !== this.state.cards.length) {
			this.logger.error('Duplicate cards found after game mode start')
		}
	}

	transition() {
		if (this.game.all(PlayerStateValue.WaitingForTurn)) {
			if (this.state.prelude) {
				return GameStateValue.Prelude
			} else {
				this.game.handleNewGeneration(1)

				return GameStateValue.GenerationInProgress
			}
		}
	}
}
