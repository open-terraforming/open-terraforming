import { Button } from '@/components'
import { Box } from '@/components/Box'
import { ClippedBox } from '@/components/ClippedBox'
import { ClippedBoxTitle } from '@/components/ClippedBoxTitle'
import { Flex } from '@/components/Flex/Flex'
import { Modal } from '@/components/Modal/Modal'
import { useGameState } from '@/utils/hooks'
import { faArrowRight, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Competitions } from '@shared/competitions'
import { Started } from '@shared/index'
import { Milestones } from '@shared/milestones'
import { styled } from 'styled-components'
import { ColonyDisplay } from '../../ColoniesModal/components/ColonyDisplay'
import { GlobalEventsDisplay } from '../../GlobalEventsModal/components/GlobalEventsDisplay'

type Props = {
	open: boolean
	onClose: () => void
	event: Started
}

export const GameSetupOverviewModal = ({ open, event, onClose }: Props) => {
	const game = useGameState()

	return (
		<Modal
			open={open}
			onClose={onClose}
			header={<h2>Game Setup</h2>}
			footer={
				<Button onClick={onClose} icon={faArrowRight}>
					Continue To Starting Hand
				</Button>
			}
			footerStyle={{ justifyContent: 'center' }}
		>
			<Container>
				<Box gap="0.5rem" wrap="wrap">
					<Flex gap="0.5rem" align="flex-start">
						{!!event.colonies?.length && (
							<ClippedBox backdrop>
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

							<Box $mt={1}>
								<ClippedBox backdrop>
									<ClippedBoxTitle $spacing>
										Milestones & Competitions
									</ClippedBoxTitle>
									<Flex>
										<Box $p={2} direction="column" gap="0.25rem">
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
										<Box $p={2} direction="column" gap="0.25rem">
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
							</Box>

							{event.globalEvents && (
								<Box $mt={2} direction="column" align="stretch">
									<ClippedBox backdrop>
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
		</Modal>
	)
}

const Container = styled.div`
	text-align: center;
`

const MilestoneContainer = styled.div`
	width: 25rem;
	text-align: left;
	overflow: hidden;
`
