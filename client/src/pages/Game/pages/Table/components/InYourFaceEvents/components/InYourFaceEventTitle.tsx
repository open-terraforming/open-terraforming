import { useLocale } from '@/context/LocaleContext'
import { Competitions } from '@shared/competitions'
import { EventType, GameEvent } from '@shared/index'
import { Milestones } from '@shared/milestones'
import { Projects } from '@shared/projects'
import { otherToStr, tileToStr } from '@shared/texts'
import { styled } from 'styled-components'
import { PlayerDidHeader } from './PlayerDidHeader'
import { useGameState } from '@/utils/hooks'

type Props = {
	event: GameEvent
}

export const InYourFaceEventTitle = ({ event }: Props) => {
	const t = useLocale()
	const game = useGameState()

	switch (event.type) {
		case EventType.CardPlayed:
			return (
				<PlayerDidHeader
					noSpacing
					playerId={event.playerId}
					thing={` played ${t.cards[event.card]}`}
				/>
			)
		case EventType.CardUsed:
			return (
				<PlayerDidHeader
					noSpacing
					playerId={event.playerId}
					thing={` used ${t.cards[event.card]}`}
				/>
			)
		case EventType.CompetitionSponsored:
			return (
				<PlayerDidHeader
					noSpacing
					playerId={event.playerId}
					thing={` sponsored ${Competitions[event.competition].title} competition`}
				/>
			)
		case EventType.MilestoneBought:
			return (
				<PlayerDidHeader
					noSpacing
					playerId={event.playerId}
					thing={` bought ${Milestones[event.milestone].title} milestone`}
				/>
			)
		case EventType.ColonyBuilt:
			return (
				<PlayerDidHeader
					noSpacing
					playerId={event.playerId}
					thing={` built colony on ${t.colonies[game.colonies[event.colony].code]}`}
				/>
			)
		case EventType.ColonyTrading:
			return (
				<PlayerDidHeader
					noSpacing
					playerId={event.playerId}
					thing={` traded with ${t.colonies[game.colonies[event.colony].code]} colony`}
				/>
			)
		case EventType.StandardProjectBought:
			return (
				<PlayerDidHeader
					playerId={event.playerId}
					noSpacing
					thing={` bought ${Projects[event.project].description} project`}
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
					thing={` placed ${
						event.other !== undefined && event.other !== null
							? otherToStr(event.other)
							: tileToStr(event.tile)
					} tile`}
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
