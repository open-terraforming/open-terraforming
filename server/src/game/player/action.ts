import {
	Card,
	CardCallbackContext,
	CardCondition,
	CardEffect,
	CardEffectArgumentType
} from '@shared/cards'
import {
	GameState,
	GameStateValue,
	PlayerState,
	PlayerStateValue
} from '@shared/index'
import { f } from '@shared/utils'
import { Player } from '../player'
import { validateArgValue } from '../validation/validate-arg-value'

export abstract class PlayerBaseAction<Args = {}> {
	abstract states: PlayerStateValue[]
	abstract gameStates: GameStateValue[]

	get logger() {
		return this.parent.logger
	}

	player: PlayerState
	game: GameState

	parent: Player

	constructor(player: Player) {
		this.parent = player
		this.player = player.state
		this.game = player.game.state
	}

	get pendingActions() {
		return this.parent.pendingActions
	}

	get pendingAction() {
		return this.parent.pendingAction
	}

	tryPerform(args: Args) {
		if (this.gameStates.length > 0 && !(this.game.state in this.gameStates)) {
			throw new Error(
				`Action not allowed when game is ${GameStateValue[this.game.state]}`
			)
		}

		if (this.states.length > 0 && !(this.player.state in this.states)) {
			throw new Error(
				`Action not allowed when player is ${
					PlayerStateValue[this.player.state]
				}`
			)
		}

		this.perform(args)
	}

	setState(state: PlayerStateValue) {
		this.logger.log(
			`${PlayerStateValue[this.player.state]} -> ${PlayerStateValue[state]}`
		)

		this.player.state = state
	}

	checkCardConditions(
		card: Card,
		ctx: CardCallbackContext,
		playArguments: CardEffectArgumentType[][],
		action = false
	) {
		const errorConditions = [
			...(action ? [] : card.conditions.filter(c => !c.evaluate(ctx))),
			...(action ? card.actionEffects : card.playEffects).reduce(
				(acc, p, ei) => [
					...acc,
					...p.conditions.filter(
						c => !c.evaluate(ctx, ...(playArguments[ei] || []))
					)
				],
				[] as CardCondition[]
			)
		]

		if (errorConditions.length > 0) {
			throw new Error(
				`Card conditions not met! ${errorConditions
					.map((c, i) => c.description || i.toString())
					.join('. ')}`
			)
		}

		if (action) {
			card.actionEffects.forEach((e, i) => {
				if (!playArguments[i]) {
					playArguments[i] = []
				}

				// TODO: More checks
				e.args.forEach((a, ai) => {
					const value = playArguments[i][ai]

					if (value === undefined) {
						throw new Error(
							`${card.code}: No value specified for effect ${i} argument ${ai}`
						)
					}

					try {
						validateArgValue({
							a,
							card,
							ctx,
							value
						})
					} catch (e) {
						throw new Error(
							f('{0}: Effect {1} argument {2} - {3}', card.title, i, ai, e)
						)
					}
				})
			})
		}
	}

	runCardEffects(
		effects: CardEffect[],
		ctx: CardCallbackContext,
		playArguments: CardEffectArgumentType[][]
	) {
		effects.forEach((e, i) => {
			e.perform(ctx, ...(playArguments[i] || []))
		})

		this.parent.filterPendingActions()
	}

	popAction() {
		if (!this.pendingAction) {
			throw new Error("Trying to pop action when there aren't any")
		}

		this.player.pendingActions = this.player.pendingActions.filter(
			a => a !== this.pendingAction
		)

		this.parent.game.filterPendingActions()

		if (this.pendingActions.length === 0) {
			switch (this.game.state) {
				case GameStateValue.GenerationInProgress: {
					switch (this.player.state) {
						case PlayerStateValue.Playing: {
							this.actionPlayed()
							break
						}
					}

					break
				}

				case GameStateValue.Starting: {
					this.setState(PlayerStateValue.WaitingForTurn)
					break
				}

				case GameStateValue.GenerationStart: {
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

	abstract perform(args: Args): void
}
