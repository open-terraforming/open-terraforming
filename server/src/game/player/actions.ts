import { GameMessage, MessageType } from '@shared/actions'
import { Player } from '../player'
import { PlayerBaseAction } from './action'
import { AdminChangeAction } from './actions/admin-change'
import { AdminLoginAction } from './actions/admin-login'
import { BuyCardAction } from './actions/buy-card'
import { BuyMilestoneAction } from './actions/buy-milestone'
import { BuyStandardProjectAction } from './actions/buy-standard-project'
import { ClaimTileAction } from './actions/claim-tile'
import { DraftCardAction } from './actions/draft-card'
import { KickPlayerAction } from './actions/kick-player'
import { PassAction } from './actions/pass'
import { PickCardsAction } from './actions/pick-cards'
import { PickColorAction } from './actions/pick-color'
import { PickCorporationAction } from './actions/pick-corporation'
import { PickPreludesAction } from './actions/pick-preludes'
import { PlaceTileAction } from './actions/place-tile'
import { PlayCardAction } from './actions/play-card'
import { SponsorCompetitionAction } from './actions/sponsor-competition'
import { StartGameAction } from './actions/start-game'
import { ToggleReadyAction } from './actions/toggle-ready'

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
			[MessageType.StartGame]: new StartGameAction(this.player),
			[MessageType.PlayerPass]: new PassAction(this.player),
			[MessageType.DraftCard]: new DraftCardAction(this.player)
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
