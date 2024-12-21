import { EventType, GameEvent } from '@shared/index'
import { PlayerDidHeader } from './PlayerDidHeader'
import { styled } from 'styled-components'
import { useLocale } from '@/context/LocaleContext'

type Props = {
	event: GameEvent
}

export const InYourFaceEventTitle = ({ event }: Props) => {
	const t = useLocale()

	switch (event.type) {
		case EventType.CardPlayed:
			return (
				<PlayerDidHeader
					noSpacing
					playerId={event.playerId}
					thing=" played card"
				/>
			)
		case EventType.CardUsed:
			return (
				<PlayerDidHeader
					noSpacing
					playerId={event.playerId}
					thing=" used card"
				/>
			)
		case EventType.CompetitionSponsored:
			return (
				<PlayerDidHeader
					noSpacing
					playerId={event.playerId}
					thing=" sponsored competition"
				/>
			)
		case EventType.MilestoneBought:
			return (
				<PlayerDidHeader
					noSpacing
					playerId={event.playerId}
					thing=" bought milestone"
				/>
			)
		case EventType.ColonyBuilt:
			return (
				<PlayerDidHeader
					noSpacing
					playerId={event.playerId}
					thing=" built colony"
				/>
			)
		case EventType.ColonyTrading:
			return (
				<PlayerDidHeader
					noSpacing
					playerId={event.playerId}
					thing=" traded with colony"
				/>
			)
		case EventType.StandardProjectBought:
			return (
				<PlayerDidHeader
					playerId={event.playerId}
					noSpacing
					thing=" bought standard project"
				/>
			)
		case EventType.StartingSetup:
			return (
				<PlayerDidHeader
					playerId={event.playerId}
					noSpacing
					thing=" picked their starting setup"
				/>
			)
		case EventType.TilePlaced:
			return (
				<PlayerDidHeader
					playerId={event.playerId}
					noSpacing
					thing=" placed tile"
				/>
			)
		case EventType.ProductionDone:
			return <CenterText>Production</CenterText>
		case EventType.MarsTerraformed:
			return <CenterText>Mars terraformed</CenterText>
		case EventType.GlobalEventsChanged:
			return <CenterText>Global events changed</CenterText>
		case EventType.CurrentGlobalEventExecuted:
			return <CenterText>Global event executed</CenterText>
		case EventType.NewGovernment:
			return <CenterText>New government</CenterText>
		case EventType.PlayerMovedDelegate:
			return (
				<PlayerDidHeader
					playerId={event.playerId}
					noSpacing
					thing={` added delegate to ${t.committeeParties[event.partyCode]}`}
				/>
			)
		case EventType.CommitteePartyActivePolicyActivated:
			return (
				<PlayerDidHeader
					playerId={event.playerId}
					noSpacing
					thing=" used ruling policy"
				/>
			)
		default:
			return null
	}
}

const CenterText = styled.div`
	text-align: center;
`
