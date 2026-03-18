import { EventType, GameEvent } from '@shared/index'

type Params = {
	event: GameEvent
}

const PROCESSABLE_EVENTS = [
	EventType.CardPlayed,
	EventType.CardUsed,
	EventType.StandardProjectBought,
	EventType.MilestoneBought,
	EventType.CompetitionSponsored,
	EventType.ColonyBuilt,
	EventType.ColonyTrading,
	EventType.StartingSetup,
	EventType.ProductionDone,
	EventType.TilePlaced,
	EventType.MarsTerraformed,
	EventType.GlobalEventsChanged,
	EventType.CurrentGlobalEventExecuted,
	EventType.NewGovernment,
	EventType.PlayerMovedDelegate,
	EventType.CommitteePartyActivePolicyActivated,
]

export const isInYourFaceEvent = ({ event }: Params) => {
	if (event.processed) {
		return false
	}

	return PROCESSABLE_EVENTS.includes(event.type)
}
