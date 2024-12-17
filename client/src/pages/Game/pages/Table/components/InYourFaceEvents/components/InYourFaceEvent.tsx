import { EventType, GameEvent } from '@shared/index'
import { useCallback } from 'react'
import { CardPlayedEvent } from './CardPlayedEvent'
import { CardUsedEvent } from './CardUsedEvent'
import { ColonyBuiltEvent } from './ColonyBuiltEvent'
import { ColonyTradingEvent } from './ColonyTradingEvent'
import { CommitteePartyActivePolicyActivatedEvent } from './CommitteePartyActivePolicyActivatedEvent'
import { CompetitionSponsoredEvent } from './CompetitionSponsoredEvent'
import { CurrentGlobalEventExecutedEvent } from './CurrentGlobalEventExecuted'
import { GlobalEventsChangedEvent } from './GlobalEventsChangedEvent'
import { MarsTerraformedEvent } from './MarsTerraformedEvent'
import { MilestoneBoughtEvent } from './MilestoneBoughtEvent'
import { NewGovernmentEvent } from './NewGovernmentEvent'
import { PlayerMovedDelegateEvent } from './PlayerMovedDelegateEvent'
import { ProductionDoneEvent } from './ProductionDoneEvent'
import { StandardProjectBoughtEvent } from './StandardProjectBoughtEvent'
import { StartingSetupEvent } from './StartingSetupEvent'
import { TilePlacedEvent } from './TilePlacedEvent'

type Props = {
	event: GameEvent
}

export const InYourFaceEvent = ({ event }: Props) => {
	const renderEvent = useCallback((event: GameEvent) => {
		switch (event.type) {
			case EventType.CardPlayed:
				return <CardPlayedEvent event={event} />
			case EventType.CardUsed:
				return <CardUsedEvent event={event} />
			case EventType.StandardProjectBought:
				return <StandardProjectBoughtEvent event={event} />
			case EventType.MilestoneBought:
				return <MilestoneBoughtEvent event={event} />
			case EventType.CompetitionSponsored:
				return <CompetitionSponsoredEvent event={event} />
			case EventType.ColonyBuilt:
				return <ColonyBuiltEvent event={event} />
			case EventType.ColonyTrading:
				return <ColonyTradingEvent event={event} />
			case EventType.StartingSetup:
				return <StartingSetupEvent event={event} />
			case EventType.ProductionDone:
				return <ProductionDoneEvent event={event} />
			case EventType.TilePlaced:
				return <TilePlacedEvent event={event} />
			case EventType.MarsTerraformed:
				return <MarsTerraformedEvent />
			case EventType.GlobalEventsChanged:
				return <GlobalEventsChangedEvent event={event} />
			case EventType.CurrentGlobalEventExecuted:
				return <CurrentGlobalEventExecutedEvent event={event} />
			case EventType.NewGovernment:
				return <NewGovernmentEvent event={event} />
			case EventType.PlayerMovedDelegate:
				return <PlayerMovedDelegateEvent event={event} />
			case EventType.CommitteePartyActivePolicyActivated:
				return <CommitteePartyActivePolicyActivatedEvent event={event} />
			default:
				return null
		}
	}, [])

	return renderEvent(event)
}
