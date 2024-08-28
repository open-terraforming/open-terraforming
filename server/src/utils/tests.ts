import { Game } from '@/game/game'
import { Player } from '@/game/player'
import { PlayerBaseAction } from '@/game/player/action'
import { StartGameAction } from '@/game/player/actions/start-game'

export const prepareGame = (
	actionBuilder?: (p: Player) => PlayerBaseAction,
) => {
	const game = new Game()
	const player = new Player(game)
	game.add(player, false)

	const action = actionBuilder
		? actionBuilder(player)
		: new StartGameAction(player)

	return {
		game: game.state,
		player: player.state,
		gameObj: game,
		playerObj: player,
		action,
	}
}
