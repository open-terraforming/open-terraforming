import { Player } from './player'
import { PlayerStateValue } from '@shared/game'
import { Game } from './game'
import { shuffle } from '@/utils/collections'
import { Corporations } from '@shared/corporations'

const BotNames = ['Rick', 'Jon', 'Joana', 'James', 'Jack', 'Oprah', 'Trump']

let names = [] as string[]
const pickBotName = () => {
	if (names.length === 0) {
		names = shuffle(BotNames)
	}

	return names.pop() || '<unnamed>'
}

export class Bot extends Player {
	passing?: ReturnType<typeof setTimeout>

	constructor(game: Game) {
		super(game)

		this.name = pickBotName()
		this.state.connected = true
		this.state.bot = true
		this.gameState.state = PlayerStateValue.Ready
		this.updated()

		this.game.onStateUpdated.on(() => this.updated(false))
	}

	updated(broadcast = true) {
		switch (this.gameState.state) {
			case PlayerStateValue.Waiting: {
				this.setState(PlayerStateValue.Ready)
				break
			}

			case PlayerStateValue.PickingCorporation: {
				this.pickCorporation(Corporations[0].code)
				break
			}

			case PlayerStateValue.PickingCards: {
				this.pickCards([])
				break
			}

			case PlayerStateValue.Playing: {
				if (!this.passing) {
					this.passing = setTimeout(() => {
						this.pass(true)
						this.passing = undefined
					}, 100 + Math.random() * 500)
				}
				break
			}
		}

		if (broadcast) {
			super.updated()
		}
	}
}
