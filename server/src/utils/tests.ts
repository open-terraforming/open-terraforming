import { DummyGameLockSystem } from '@/lib/dummy-game-lock-system'
import { Game } from '@shared/game/game'
import { Player } from '@shared/game/player'
import { PlayerBaseActionHandler } from '@shared/game/player/action'
import { StartGameAction } from '@shared/game/player/actions/start-game'
import { NullLogger } from '@shared/lib/null-logger'

export const prepareGame = (
	actionBuilder?: (p: Player) => PlayerBaseActionHandler,
) => {
	const game = new Game(new DummyGameLockSystem(), new NullLogger())
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
