import { MessageType, GameMessage } from '@shared/actions'
import { PlayerBaseAction } from './action'
import { Player } from '../player'
import { ToggleReadyAction } from './actions/toggle-ready'
import { PickCorporationAction } from './actions/pick-corporation'
import { PickCardsAction } from './actions/pick-cards'
import { PickPreludesAction } from './actions/pick-preludes'
import { PickColorAction } from './actions/pick-color'
import { BuyCardAction } from './actions/buy-card'
import { BuyMilestoneAction } from './actions/buy-milestone'
import { BuyStandardProjectAction } from './actions/buy-standard-project'
import { SponsorCompetitionAction } from './actions/sponsor-competition'
import { PlayCardAction } from './actions/play-card'
import { PlaceTileAction } from './actions/place-tile'
import { ClaimTileAction } from './actions/claim-tile'
import { KickPlayerAction } from './actions/kick-player'
import { AdminLoginAction } from './actions/admin-login'
import { AdminChangeAction } from './actions/admin-change'
import { StartGameAction } from './actions/start-game'

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
