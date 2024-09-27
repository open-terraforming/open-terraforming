import { GameMessage, MessageType } from '@shared/actions'
import { Player } from '../player'
import { PlayerBaseAction } from './action'
import { AddCardResourceAction } from './actions/add-card-resource-action'
import { AdminChangeAction } from './actions/admin-change'
import { AdminLoginAction } from './actions/admin-login'
import { BuyCardAction } from './actions/buy-card'
import { BuyMilestoneAction } from './actions/buy-milestone'
import { BuyStandardProjectAction } from './actions/buy-standard-project'
import { ClaimTileAction } from './actions/claim-tile'
import { DiscardCardsAction } from './actions/discard-cards'
import { DraftCardAction } from './actions/draft-card'
import { KickPlayerAction } from './actions/kick-player'
import { PassAction } from './actions/pass'
import { PickCardsAction } from './actions/pick-cards'
import { PickColorAction } from './actions/pick-color'
import { PickPreludesAction } from './actions/pick-preludes'
import { PickStartingAction } from './actions/pick-starting'
import { PlaceTileAction } from './actions/place-tile'
import { PlayCardAction } from './actions/play-card'
import { SolarPhaseTerraform } from './actions/solar-phase-terraform'
import { SponsorCompetitionAction } from './actions/sponsor-competition'
import { StartGameAction } from './actions/start-game'
import { ToggleReadyAction } from './actions/toggle-ready'
import { TradeWithColonyAction } from './actions/trade-with-colony'
import { BuildColonyAction } from './actions/build-colony'
import { ChangeColonyStep } from './actions/change-colony-step'
import { AddBotAction } from './actions/add-bot'

export class PlayerActions {
	player: Player
	actions: Record<MessageType, PlayerBaseAction | null>

	constructor(player: Player) {
		this.player = player

		this.actions = {
			[MessageType.JoinRequest]: null,
			[MessageType.JoinResponse]: null,
			[MessageType.HandshakeRequest]: null,
			[MessageType.HandshakeResponse]: null,
			[MessageType.ServerMessage]: null,
			[MessageType.GameStateUpdate]: null,
			[MessageType.GameStateFull]: null,
			[MessageType.Kicked]: null,
			[MessageType.SpectateRequest]: null,
			[MessageType.SpectateResponse]: null,
			// TODO: Unused?
			[MessageType.SellCard]: null,
			[MessageType.PlayerReady]: new ToggleReadyAction(this.player),
			[MessageType.PickStarting]: new PickStartingAction(this.player),
			[MessageType.PickCards]: new PickCardsAction(this.player),
			[MessageType.PickPreludes]: new PickPreludesAction(this.player),
			[MessageType.PickColor]: new PickColorAction(this.player),
			[MessageType.BuyCard]: new BuyCardAction(this.player),
			[MessageType.BuyStandardProject]: new BuyStandardProjectAction(
				this.player,
			),
			[MessageType.BuyMilestone]: new BuyMilestoneAction(this.player),
			[MessageType.SponsorCompetition]: new SponsorCompetitionAction(
				this.player,
			),
			[MessageType.PlayCard]: new PlayCardAction(this.player),
			[MessageType.PlaceTile]: new PlaceTileAction(this.player),
			[MessageType.ClaimTile]: new ClaimTileAction(this.player),
			[MessageType.KickPlayer]: new KickPlayerAction(this.player),
			[MessageType.AdminLogin]: new AdminLoginAction(this.player),
			[MessageType.AdminChange]: new AdminChangeAction(this.player),
			[MessageType.StartGame]: new StartGameAction(this.player),
			[MessageType.PlayerPass]: new PassAction(this.player),
			[MessageType.DraftCard]: new DraftCardAction(this.player),
			[MessageType.SolarPhaseTerraform]: new SolarPhaseTerraform(this.player),
			[MessageType.AddCardResource]: new AddCardResourceAction(this.player),
			[MessageType.DiscardCards]: new DiscardCardsAction(this.player),
			[MessageType.TradeWithColony]: new TradeWithColonyAction(this.player),
			[MessageType.BuildColony]: new BuildColonyAction(this.player),
			[MessageType.ChangeColonyStep]: new ChangeColonyStep(this.player),
			[MessageType.AddBot]: new AddBotAction(this.player),
		}
	}

	perform(action: GameMessage) {
		const actionLogic = this.actions[action.type]

		if (!actionLogic) {
			throw new Error(`Unknown action ${MessageType[action.type]}`)
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return actionLogic.tryPerform((action as any).data)
	}
}
