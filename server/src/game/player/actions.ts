import { MessageType, GameMessage } from '@shared/actions'
import { PlayerBaseAction } from './action'
import { Player } from '../player'
import { ToggleReadyAction } from './toggle-ready'
import { PickCorporationAction } from './pick-corporation'
import { PickCardsAction } from './pick-cards'
import { PickPreludesAction } from './pick-preludes'
import { PickColorAction } from './pick-color'
import { BuyCardAction } from './buy-card'
import { BuyMilestoneAction } from './buy-milestone'
import { BuyStandardProjectAction } from './buy-standard-project'
import { SponsorCompetitionAction } from './sponsor-competition'
import { PlayCardAction } from './play-card'
import { PlaceTileAction } from './place-tile'
import { ClaimTileAction } from './claim-tile'
import { KickPlayerAction } from './kick-player'
import { AdminLoginAction } from './admin-login'
import { AdminChangeAction } from './admin-change'
import { StartGameAction } from './start-game'

export class PlayerActions {
	player: Player
	actions: Record<number, PlayerBaseAction>

	constructor(player: Player) {
		this.player = player

		this.actions = {
			[MessageType.PlayerReady]: new ToggleReadyAction(this.player),
			[MessageType.PickCorporation]: new PickCorporationAction(this.player),
			[MessageType.PickCards]: new PickCardsAction(this.player),
			[MessageType.PickPreludes]: new PickPreludesAction(this.player),
			[MessageType.PickColor]: new PickColorAction(this.player),
			[MessageType.BuyCard]: new BuyCardAction(this.player),
			[MessageType.BuyStandardProject]: new BuyStandardProjectAction(
				this.player
			),
			[MessageType.BuyMilestone]: new BuyMilestoneAction(this.player),
			[MessageType.SponsorCompetition]: new SponsorCompetitionAction(
				this.player
			),
			[MessageType.PlayCard]: new PlayCardAction(this.player),
			[MessageType.PlaceTile]: new PlaceTileAction(this.player),
			[MessageType.ClaimTile]: new ClaimTileAction(this.player),
			[MessageType.KickPlayer]: new KickPlayerAction(this.player),
			[MessageType.AdminLogin]: new AdminLoginAction(this.player),
			[MessageType.AdminChange]: new AdminChangeAction(this.player),
			[MessageType.StartGame]: new StartGameAction(this.player)
		}
	}

	perform(action: GameMessage) {
		if (!this.actions[action.type]) {
			throw new Error(`Unknown action ${MessageType[action.type]}`)
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return this.actions[action.type].tryPerform((action as any).data)
	}
}
