import { MyEvent } from '@/utils/events'
import { Logger } from '@/utils/log'
import { Card, CardsLookupApi } from '@shared/cards'
import { MILESTONE_REWARD } from '@shared/constants'
import {
	GridCell,
	GridCellContent,
	PlayerState,
	VictoryPointsSource
} from '@shared/game'
import { GameMessage } from '@shared/index'
import { canPlace } from '@shared/placements'
import { placeTileAction, PlayerActionType } from '@shared/player-actions'
import { StandardProject } from '@shared/projects'
import { initialPlayerState } from '@shared/states'
import {
	adjacentCells,
	allCells,
	pushPendingAction,
	range
} from '@shared/utils'
import Hashids from 'hashids/cjs'
import { v4 as uuidv4 } from 'uuid'
import { Game } from './game'
import { PlayerActions } from './player/actions'

export interface CardPlayedEvent {
	player: Player
	card: Card
	cardIndex: number
}
export interface TilePlacedEvent {
	player: Player
	cell: GridCell
}

export interface ProjectBought {
	project: StandardProject
	player: Player
}

export class Player {
	static idCounter = 1

	get logger() {
		return new Logger(this.game.logger.category + ' ' + this.state.name)
	}

	state = initialPlayerState(Player.idCounter++, uuidv4())

	onStateChanged = new MyEvent<Readonly<PlayerState>>()
	onCardPlayed = new MyEvent<Readonly<CardPlayedEvent>>()
	onTilePlaced = new MyEvent<Readonly<TilePlacedEvent>>()
	onProjectBought = new MyEvent<Readonly<ProjectBought>>()

	game: Game

	get gameState() {
		return this.state.state
	}

	get corporation() {
		return CardsLookupApi.get(this.state.corporation)
	}

	get id() {
		return this.state.id
	}

	get name() {
		return this.state.name
	}

	get actionsPlayed() {
		return this.state.actionsPlayed
	}

	actions = new PlayerActions(this)

	constructor(game: Game) {
		this.game = game

		this.state.session = new Hashids(this.game.config.adminPassword, 5).encode(
			this.state.id
		)
	}

	performAction(action: GameMessage) {
		this.actions.perform(action)
		this.updated()
	}

	buyAllGreeneries() {
		range(0, Math.floor(this.state.plants / this.state.greeneryCost)).forEach(
			() => {
				pushPendingAction(
					this.state,
					placeTileAction({ type: GridCellContent.Forest })
				)

				this.state.plants -= this.state.greeneryCost
			}
		)
	}

	updated() {
		this.logger.category = this.state.name
		this.onStateChanged.emit(this.state)
	}

	endGeneration() {
		const state = this.state

		// Perform production
		state.heat += state.energy + state.heatProduction
		state.energy = state.energyProduction
		state.ore += state.oreProduction
		state.titan += state.titanProduction
		state.plants += state.plantsProduction
		state.money += state.terraformRating + state.moneyProduction

		// Reset playable cards
		state.usedCards.forEach(c => (c.played = false))
	}

	filterPendingActions() {
		this.state.pendingActions = this.state.pendingActions.filter(p => {
			if (p.type !== PlayerActionType.PlaceTile) {
				return true
			}

			if (p.state.type === GridCellContent.Ocean) {
				return this.game.state.oceans < this.game.state.map.oceans
			}

			return (
				allCells(this.game.state).find(c =>
					canPlace(this.game.state, this.state, c, p.state)
				) !== undefined
			)
		})
	}

	finishGame() {
		this.state.victoryPoints.push({
			source: VictoryPointsSource.Rating,
			amount: this.state.terraformRating
		})

		const cardVps = this.state.usedCards.reduce((acc, state) => {
			const card = CardsLookupApi.get(state.code)
			acc += card.victoryPoints

			if (card.victoryPointsCallback) {
				acc += card.victoryPointsCallback.compute({
					card: state,
					game: this.game.state,
					player: this.state
				})
			}

			return acc
		}, 0)

		const tileVps = allCells(this.game.state).reduce(
			(acc, cell) => {
				if (cell.ownerId === this.id) {
					switch (cell.content) {
						case GridCellContent.Forest: {
							acc.forests += 1
							break
						}

						case GridCellContent.City: {
							acc.cities += adjacentCells(
								this.game.state,
								cell.x,
								cell.y
							).filter(c => c.content === GridCellContent.Forest).length

							break
						}
					}
				}

				return acc
			},
			{ forests: 0, cities: 0 }
		)

		this.game.state.milestones
			.filter(m => m.playerId === this.state.id)
			.forEach(m => {
				this.state.victoryPoints.push({
					source: VictoryPointsSource.Milestones,
					amount: MILESTONE_REWARD,
					milestone: m.type
				})
			})

		this.state.victoryPoints.push({
			source: VictoryPointsSource.Cards,
			amount: cardVps
		})

		this.state.victoryPoints.push({
			source: VictoryPointsSource.Forests,
			amount: tileVps.forests
		})

		this.state.victoryPoints.push({
			source: VictoryPointsSource.Cities,
			amount: tileVps.cities
		})
	}
}
