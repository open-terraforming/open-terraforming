import { Card, CardType } from '@shared/cards'
import { Expansions } from '@shared/expansions'
import { Colony, GameStateValue, PlayerStateValue } from '@shared/index'
import { PlayerColors } from '@shared/player-colors'
import { shuffle } from '@shared/utils'
import { BaseGameState } from './base-game-state'
import { randomPlayerColor } from '@shared/utils/colors'
import { ExpansionType } from '@shared/expansions/types'
import { deduplicate } from '@shared/utils/deduplicate'
import { Cards } from '@shared/cards/list'
import { GlobalEvent } from '@shared/expansions/turmoil/turmoilGlobalEvent'
import { CommitteeParty } from '@shared/expansions/turmoil/committeeParty'

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
		let colonies = [] as Colony[]
		let globalEvents = [] as GlobalEvent[]
		let committeeParties = [] as CommitteeParty[]

		this.state.expansions.forEach((e) => {
			const expansion = Expansions[e]

			cards = cards.concat(expansion.getCards(this.state))

			if (deduplicate(cards).length !== cards.length) {
				this.logger.error(
					'Duplicate cards found after adding',
					ExpansionType[e],
				)
			}

			colonies = colonies.concat(expansion.getColonies(this.state))

			if (deduplicate(colonies).length !== colonies.length) {
				this.logger.error(
					'Duplicate colonies found after adding',
					ExpansionType[e],
				)
			}

			globalEvents = globalEvents.concat(expansion.getGlobalEvents(this.state))

			if (deduplicate(globalEvents).length !== globalEvents.length) {
				this.logger.error(
					'Duplicate globalEvents found after adding',
					ExpansionType[e],
				)
			}

			committeeParties = committeeParties.concat(
				expansion.getCommitteeParties(this.state),
			)

			if (deduplicate(committeeParties).length !== committeeParties.length) {
				this.logger.error(
					'Duplicate committeeParties found after adding',
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
