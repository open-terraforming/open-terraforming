import {
	Card,
	CardCallbackContext,
	CardCondition,
	CardEffect,
	CardEffectArgumentTileValue,
	CardEffectArgumentType,
	CardEffectArgumentValue,
	CardPassiveEffect,
} from '@shared/cards'
import {
	GameStateValue,
	GridCellLocation,
	PlayerStateValue,
} from '@shared/index'
import { f } from '@shared/utils/f'
import { getPlayerIndex } from '@shared/utils/getPlayerIndex'
import { GameEvent } from '../events/eventTypes'
import { Player } from '../player'
import { validateArgValue } from '../validation/validate-arg-value'

export abstract class PlayerBaseActionHandler<Args = unknown> {
	abstract states: PlayerStateValue[]
	abstract gameStates: GameStateValue[]

	get logger() {
		return this.parent.logger
	}

	get player() {
		return this.parent.state
	}

	get game() {
		return this.parent.game.state
	}

	private _playerIndex: number | undefined

	get playerIndex() {
		if (this._playerIndex !== undefined) {
			return this._playerIndex
		}

		return (this._playerIndex = getPlayerIndex(this.game, this.player.id))
	}

	parent: Player

	constructor(player: Player) {
		this.parent = player
	}

	get pendingActions() {
		return this.parent.pendingActions
	}

	get pendingAction() {
		return this.parent.pendingAction
	}

	tryPerform(args: Args) {
		const name = this.constructor.name

		if (
			this.gameStates.length > 0 &&
			!this.gameStates.includes(this.game.state)
		) {
			throw new Error(
				`${name} not allowed when game is ${GameStateValue[this.game.state]}`,
			)
		}

		if (this.states.length > 0 && !this.states.includes(this.player.state)) {
			throw new Error(
				`${name} not allowed when player is ${
					PlayerStateValue[this.player.state]
				}`,
			)
		}

		this.perform(args)
	}

	setState(state: PlayerStateValue) {
		this.logger.log(
			`${PlayerStateValue[this.player.state]} -> ${PlayerStateValue[state]}`,
		)

		this.player.state = state
	}

	checkCardConditions(
		card: Card,
		ctx: CardCallbackContext,
		playArguments: CardEffectArgumentValue[][],
		action = false,
	) {
		const errorConditions = [
			...(action ? [] : card.conditions.filter((c) => !c.evaluate(ctx))),
			...(action ? card.actionEffects : card.playEffects).reduce(
				(acc, p, ei) => [
					...acc,
					...p.conditions.filter(
						(c) => !c.evaluate(ctx, ...(playArguments[ei] || [])),
					),
				],
				[] as CardCondition[],
			),
		]

		if (errorConditions.length > 0) {
			throw new Error(
				`Card conditions not met! ${errorConditions
					.map((c, i) => c.description || i.toString())
					.join('. ')}`,
			)
		}

		const usedTiles = [] as {
			x: number
			y: number
			location?: GridCellLocation
		}[]

		const effects = action ? card.actionEffects : card.playEffects

		effects.forEach((e, i) => {
			if (!playArguments[i]) {
				playArguments[i] = []
			}

			// TODO: More checks
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			e.args.forEach((a: any, ai: number) => {
				const value = playArguments[i][ai]

				try {
					validateArgValue({
						a,
						card,
						ctx,
						value,
						usedTiles,
					})
				} catch (e) {
					throw new Error(
						f(
							'{0}: Effect {1} argument {2} - {3}',
							card.code,
							i,
							ai,
							String(e),
						),
					)
				}

				if (a.type === CardEffectArgumentType.Tile && value) {
					const valueAsTile = value as CardEffectArgumentTileValue

					usedTiles.push({
						x: valueAsTile[0],
						y: valueAsTile[1],
						location: valueAsTile[2] ?? undefined,
					})
				}
			})
		})
	}

	runCardEffects(
		effects: CardEffect[],
		ctx: CardCallbackContext,
		playArguments: CardEffectArgumentValue[][],
	) {
		effects.forEach((e, i) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			e.perform(ctx, ...((playArguments[i] || []) as any))
		})

		this.parent.filterPendingActions()
	}

	runCardPassiveEffectsOnBuy(
		effects: CardPassiveEffect[],
		ctx: CardCallbackContext,
	) {
		effects.forEach((e) => {
			e.onPlay?.(ctx)
		})

		this.parent.filterPendingActions()
	}

	popAction(countsAsAction = true) {
		if (!this.pendingAction) {
			throw new Error("Trying to pop action when there aren't any")
		}

		this.player.pendingActions = this.player.pendingActions.filter(
			(a) => a !== this.pendingAction,
		)

		this.parent.game.filterPendingActions()

		if (this.pendingActions.length === 0) {
			switch (this.game.state) {
				case GameStateValue.GenerationInProgress: {
					switch (this.player.state) {
						case PlayerStateValue.Playing: {
							if (countsAsAction) {
								this.actionPlayed()
							}

							break
						}
					}

					break
				}

				case GameStateValue.Starting: {
					this.setState(PlayerStateValue.WaitingForTurn)
					break
				}

				case GameStateValue.Draft:

				case GameStateValue.ResearchPhase: {
					this.setState(PlayerStateValue.WaitingForTurn)
					break
				}

				case GameStateValue.EndingTiles: {
					this.setState(PlayerStateValue.Passed)
					break
				}
			}
		}
	}

	actionPlayed() {
		this.player.actionsPlayed++

		if (this.player.actionsPlayed >= 2) {
			this.setState(PlayerStateValue.WaitingForTurn)
		}
	}

	pushEvent<TEvent extends Omit<GameEvent, 't'>>(event: TEvent) {
		this.parent.game.pushEvent(event)
	}

	startCollectingEvents() {
		return this.parent.game.startEventsCollector()
	}

	abstract perform(args: Args): void
}
