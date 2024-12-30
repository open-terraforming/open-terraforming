import { Box } from '@/components/Box'
import { ClippedBox } from '@/components/ClippedBox'
import { ClippedBoxTitle } from '@/components/ClippedBoxTitle'
import { Flex } from '@/components/Flex/Flex'
import { useGameState } from '@/utils/hooks'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Competitions } from '@shared/competitions'
import { Started } from '@shared/index'
import { Milestones } from '@shared/milestones'
import { styled } from 'styled-components'
import { ColonyDisplay } from '../../ColoniesModal/components/ColonyDisplay'
import { GlobalEventsDisplay } from '../../GlobalEventsModal/components/GlobalEventsDisplay'

type Props = {
	event: Started
}

export const GameStartedEvent = ({ event }: Props) => {
	const game = useGameState()

	return (
		<Container>
			<SubTitle>Game Setup</SubTitle>

			<Box gap="0.5rem" wrap="wrap">
				<Flex gap="0.5rem" align="flex-start">
					{event.colonies && (
						<ClippedBox>
							<ClippedBoxTitle $spacing>Colonies</ClippedBoxTitle>
							<Box $p={2} wrap="wrap" justify="center" align="stretch">
								{event.colonies.map((c, index) => (
									<ColonyDisplay
										key={c.code}
										index={index}
										colony={c}
										noActions
									/>
								))}
							</Box>
						</ClippedBox>
					)}

					<div>
						<ClippedBox>
							<ClippedBoxTitle $spacing>Players</ClippedBoxTitle>
							<Box
								$p={2}
								wrap="wrap"
								justify="center"
								align="stretch"
								gap="0.5rem"
							>
								{event.players.map((player) => (
									<Flex key={player.id} gap="0.25rem">
										<FontAwesomeIcon icon={faUser} color={player.color} />
										{player.name}
									</Flex>
								))}
							</Box>
						</ClippedBox>
						<ClippedBox style={{ flex: 1 }}>
							<ClippedBoxTitle $spacing>
								Milestones & Competitions
							</ClippedBoxTitle>
							<Flex>
								<Box
									$p={2}
									justify="center"
									gap="0.25rem"
									wrap="wrap"
									align="stretch"
								>
									{game.map.milestones.map((m) => (
										<MilestoneContainer key={m}>
											<ClippedBox>
												<ClippedBoxTitle $spacing>
													{Milestones[m].title}
												</ClippedBoxTitle>
												<Box $p={2}>
													<div>{Milestones[m].description}</div>
													<Box $ml="auto">{Milestones[m].limit}</Box>
												</Box>
											</ClippedBox>
										</MilestoneContainer>
									))}
								</Box>
								<Box
									$p={2}
									justify="center"
									gap="0.25rem"
									wrap="wrap"
									align="stretch"
								>
									{game.map.competitions.map((c) => (
										<MilestoneContainer key={c}>
											<ClippedBox>
												<ClippedBoxTitle $spacing>
													{Competitions[c].title}
												</ClippedBoxTitle>
												<Box $p={2}>{Competitions[c].description}</Box>
											</ClippedBox>
										</MilestoneContainer>
									))}
								</Box>
							</Flex>
						</ClippedBox>
						{event.globalEvents && (
							<Box $mt={2} direction="column" align="stretch">
								<ClippedBox>
									<ClippedBoxTitle $spacing>Global Events</ClippedBoxTitle>
									<Box $p={2} justify="center">
										<GlobalEventsDisplay
											comingEvent={event.globalEvents.coming}
											currentEvent={event.globalEvents.current}
											distantEvent={event.globalEvents.distant}
										/>
									</Box>
								</ClippedBox>
							</Box>
						)}
					</div>
				</Flex>
			</Box>
		</Container>
	)
}

const Container = styled.div`
	text-align: center;
	margin: 1rem 3rem;
`

const SubTitle = styled.div`
	font-size: 1.25rem;
	margin: 1.25rem 0 0.5rem 0;
	text-transform: uppercase;
`

const MilestoneContainer = styled.div`
	width: 25rem;
	text-align: left;
`
