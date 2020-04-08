import { colors } from '@/styles'
import { useAppStore } from '@/utils/hooks'
import {
	faArrowRight,
	faCheck,
	faEthernet,
	faHourglassHalf,
	faUserClock,
	faChevronRight,
	faUserSlash,
	faRobot
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PlayerState, PlayerStateValue } from '@shared/index'
import React from 'react'
import styled, { css } from 'styled-components'

const stateToStr = {
	[PlayerStateValue.Passed]: 'Passed',
	[PlayerStateValue.Playing]: 'Playing',
	[PlayerStateValue.WaitingForTurn]: 'Waiting',
	[PlayerStateValue.PickingCards]: 'Picking cards',
	[PlayerStateValue.PickingCorporation]: 'Picking corporation',
	[PlayerStateValue.Connecting]: 'Connecting',
	[PlayerStateValue.Waiting]: null,
	[PlayerStateValue.Ready]: null
} as const

const stateToIcon = {
	[PlayerStateValue.Passed]: faCheck,
	[PlayerStateValue.Playing]: faArrowRight,
	[PlayerStateValue.WaitingForTurn]: faHourglassHalf,
	[PlayerStateValue.PickingCards]: faUserClock,
	[PlayerStateValue.PickingCorporation]: faUserClock,
	[PlayerStateValue.Connecting]: faEthernet,
	[PlayerStateValue.Waiting]: faHourglassHalf,
	[PlayerStateValue.Ready]: faCheck
} as const

export const Player = ({
	player,
	starting,
	onClick
}: {
	player: PlayerState
	starting: boolean
	onClick: () => void
}) => {
	const state = player

	const isPlaying = state.state === PlayerStateValue.Playing

	const isPlayer = player.id === useAppStore(state => state.game.playerId)

	return (
		<Container onClick={onClick} isPlaying={isPlaying}>
			<InfoContainer>
				<NameContainer>
					<Name>
						{!player.connected && (
							<FontAwesomeIcon
								className="mr-2"
								size="sm"
								title="Disconnected"
								icon={faUserSlash}
							/>
						)}
						{player.bot && (
							<FontAwesomeIcon
								className="mr-2"
								size="sm"
								title="Bot"
								icon={faRobot}
							/>
						)}
						{player.name}
						{isPlayer ? ' (You)' : ''}
					</Name>
					<Rating>{state.terraformRating}</Rating>
				</NameContainer>
				<State>
					{isPlaying ? (
						<>
							<FontAwesomeIcon
								icon={faChevronRight}
								color="#F5FC78"
								fixedWidth
							/>
							{`Action ${state.actionsPlayed} of 2`}
						</>
					) : (
						<>
							{stateToIcon[state.state] && (
								<FontAwesomeIcon
									icon={stateToIcon[state.state]}
									fixedWidth
									size="sm"
								/>
							)}{' '}
							{stateToStr[state.state] || PlayerStateValue[state.state]}
						</>
					)}
				</State>
			</InfoContainer>
			<Color style={{ backgroundColor: player.color }} />
			{starting && (
				<Starting title="This player is first this generation">1</Starting>
			)}
		</Container>
	)
}

const NameContainer = styled.div`
	display: flex;
	align-items: center;
`

const Container = styled.div<{ isPlaying: boolean }>`
	margin-bottom: 1rem;
	opacity: 0.8;
	display: flex;
	cursor: pointer;

	${props =>
		props.isPlaying &&
		css`
			opacity: 1;
		`}
`

const InfoContainer = styled.div`
	width: 10rem;
	background-color: ${colors.background};
`

const Name = styled.div`
	background-color: ${colors.background};
	padding: 0.2rem 0.5rem;
	flex-grow: 1;
	text-overflow: ellipsis;
	white-space: nowrap;
`

const Rating = styled.div`
	padding: 0.2rem 0.5rem;
`

const State = styled.div`
	padding: 0.2rem 0.5rem;
`

const Color = styled.div`
	width: 10px;
`

const Starting = styled.div`
	background: ${colors.background};
	border-radius: 50%;
	width: 2rem;
	height: 2rem;
	line-height: 2rem;
	text-align: center;
	align-self: center;
	margin-left: 0.25rem;
`
