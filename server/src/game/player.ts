import { MyEvent } from '@/utils/events'
import { Logger } from '@/utils/log'
import { Card, CardsLookupApi } from '@shared/cards'
import { GridCell, GridCellContent, PlayerState } from '@shared/game'
import { GameMessage } from '@shared/index'
import { canPlace } from '@shared/placements'
import {
	placeTileAction,
	PlayerActionType,
	PlayerAction
} from '@shared/player-actions'
import { StandardProject } from '@shared/projects'
import { initialPlayerState } from '@shared/states'
import {
	allCells,
	pushPendingAction,
	range,
	pendingActions
} from '@shared/utils'
import { getVictoryPoints } from '@shared/vps'
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

	get pendingActions() {
		return pendingActions(this.state)
	}

	get pendingAction(): PlayerAction | undefined {
		return this.pendingActions[0]
	}

	actions: PlayerActions

	constructor(game: Game) {
		this.game = game

		this.state.session = new Hashids(this.game.config.adminPassword, 5).encode(
			this.state.id
		)

		this.actions = new PlayerActions(this)
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
		this.state.victoryPoints = getVictoryPoints(this.game.state, this.state)
	}
}
