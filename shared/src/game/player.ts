import { Card, CardsLookupApi, Production, Resource } from '@shared/cards'
import {
	ColonyState,
	GridCell,
	GridCellContent,
	PlayerState,
} from '@shared/game'
import { GameMessage, PLAYER_PRODUCTION_FIELDS } from '@shared/index'
import { canPlace } from '@shared/placements'
import {
	placeTileAction,
	PlayerAction,
	PlayerActionType,
} from '@shared/player-actions'
import { StandardProject } from '@shared/projects'
import { initialPlayerState } from '@shared/states'
import {
	allCells,
	pendingActions,
	pushPendingAction,
	range,
} from '@shared/utils'
import { deepCopy } from '@shared/utils/collections'
import { MyEvent } from '@shared/utils/events'
import { getVictoryPoints } from '@shared/vps'
import { v4 as uuidv4 } from 'uuid'
import { generateSession } from '../utils/generate-session'
import { Game } from './game'
import { PlayerActions } from './player/actions'
import { mapCards } from '@shared/utils/mapCards'

export interface CardBoughtEvent {
	player: Player
	card: Card
	cardIndex: number
	moneyCost: number
}
export interface TilePlacedEvent {
	player: Player
	cell: GridCell
}

export interface ProductionChangedEvent {
	player: Player
	production: Production
	change: number
}

export interface ProjectBoughtEvent {
	project: StandardProject
	player: Player
}

export interface BeforeColonyTradeEvent {
	player: Player
	colony: ColonyState
	resource: Resource
}

export interface ColonyBuiltEvent {
	player: Player
	colony: ColonyState
}

export class Player {
	static idCounter = 1

	get logger() {
		return this.game.logger.child(this.state.name)
	}

	state = initialPlayerState(Player.idCounter++, uuidv4())

	onStateChanged = new MyEvent<Readonly<PlayerState>>()
	onCardBought = new MyEvent<Readonly<CardBoughtEvent>>()
	onTilePlaced = new MyEvent<Readonly<TilePlacedEvent>>()
	onBeforeColonyTrade = new MyEvent<Readonly<BeforeColonyTradeEvent>>()
	onColonyBuilt = new MyEvent<Readonly<ColonyBuiltEvent>>()
	onProjectBought = new MyEvent<Readonly<ProjectBoughtEvent>>()
	onProductionChanged = new MyEvent<Readonly<ProductionChangedEvent>>()

	previousState: PlayerState | undefined

	disconnectTimeout?: NodeJS.Timeout

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

		this.state.session = generateSession()

		this.state.admin = game.config.everybodyIsAdmin

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
					placeTileAction({ type: GridCellContent.Forest }),
				)

				this.state.plants -= this.state.greeneryCost
			},
		)
	}

	updated() {
		this.logger.setCategory(this.state.name)
		this.onStateChanged.emit(this.state)

		if (this.previousState !== undefined) {
			for (const production of PLAYER_PRODUCTION_FIELDS) {
				const change = this.state[production] - this.previousState[production]

				if (change !== 0) {
					this.onProductionChanged.emit({
						player: this,
						production,
						change,
					})
				}
			}
		}

		this.previousState = deepCopy(this.state)
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
		state.usedCards.forEach((c) => (c.played = false))
	}

	filterPendingActions() {
		this.state.pendingActions = this.state.pendingActions.filter((p) => {
			// This shouldn't happen, but just to be sure
			if (
				p.type === PlayerActionType.AddCardResource &&
				!mapCards(this.state.usedCards).some(
					(c) => c.info.resource === p.data.cardResource,
				)
			) {
				return false
			}

			if (p.type !== PlayerActionType.PlaceTile) {
				return true
			}

			if (p.state.type === GridCellContent.Ocean) {
				return this.game.state.oceans < this.game.state.map.oceans
			}

			return (
				allCells(this.game.state).find((c) =>
					canPlace(this.game.state, this.state, c, p.state),
				) !== undefined
			)
		})
	}

	handleConnect() {
		if (this.disconnectTimeout) {
			clearTimeout(this.disconnectTimeout)
			this.disconnectTimeout = undefined
		}

		this.state.connected = true
		this.updated()
	}

	handleDisconnect() {
		if (
			this.game.config.disablePlayersWhenDisconnectedForInSeconds === undefined
		) {
			return
		}

		if (this.disconnectTimeout) {
			clearTimeout(this.disconnectTimeout)
		}

		this.disconnectTimeout = setTimeout(() => {
			this.state.connected = false
			this.updated()
		}, this.game.config.disablePlayersWhenDisconnectedForInSeconds * 1000)
	}

	finishGame() {
		this.state.victoryPoints = getVictoryPoints(this.game.state, this.state)
	}
}
