import { colors } from '@/styles'
import { useAppStore, useElementPosition } from '@/utils/hooks'
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
import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { ResourcesDiff } from './ResourcesDiff/ResourcesDiff'
import { PlayerActionType } from '@shared/player-actions'
import { pendingActions } from '@shared/utils'

// TODO: Map pending actions to strings too

const pendingToStr = {
	[PlayerActionType.PickCards]: 'Picking cards',
	[PlayerActionType.PickCorporation]: 'Picking corporation',
	[PlayerActionType.PickPreludes]: 'Picking preludes',
	[PlayerActionType.PlaceTile]: 'Placing tile',
	[PlayerActionType.ClaimTile]: 'Claiming tile',
	[PlayerActionType.PlayCard]: 'Playing card',
	[PlayerActionType.SponsorCompetition]: 'Selecting competition'
}

const stateToStr = {
	[PlayerStateValue.Passed]: 'Passed',
	[PlayerStateValue.Playing]: 'Playing',
	[PlayerStateValue.EndingTiles]: '',
	[PlayerStateValue.WaitingForTurn]: 'Waiting',
	[PlayerStateValue.Picking]: '',
	[PlayerStateValue.Connecting]: 'Connecting',
	[PlayerStateValue.Waiting]: null,
	[PlayerStateValue.Ready]: null
} as const

const stateToIcon = {
	[PlayerStateValue.Passed]: faCheck,
	[PlayerStateValue.Playing]: faArrowRight,
	[PlayerStateValue.EndingTiles]: faArrowRight,
	[PlayerStateValue.WaitingForTurn]: faHourglassHalf,
	[PlayerStateValue.Picking]: faUserClock,
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
	const [container, setContainer] = useState(null as HTMLDivElement | null)
	const position = useElementPosition(container)
	const state = player
	const isPlaying = state.state === PlayerStateValue.Playing
	const isPlayer = player.id === useAppStore(state => state.game.playerId)
	const pending = pendingActions(player)[0]

	return (
		<Container
			onClick={onClick}
			isPlaying={isPlaying}
			ref={e => setContainer(e)}
		>
			<Rating>{state.terraformRating}</Rating>
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
				</NameContainer>
				<State>
					{isPlaying ? (
						<>
							<FontAwesomeIcon
								icon={faChevronRight}
								color="#F5FC78"
								fixedWidth
							/>
							{pending
								? `${state.actionsPlayed}/2 `
								: `Action ${state.actionsPlayed} of 2`}

							{pending && `${pendingToStr[pending.type]}`}
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
							{stateToStr[state.state]}
							{pending && ` ${pendingToStr[pending.type]}`}
						</>
					)}
				</State>
			</InfoContainer>
			<Color style={{ backgroundColor: player.color }} />
			{starting && (
				<Starting title="This player is first this generation">1</Starting>
			)}
			<ResourcesDiff
				player={player}
				x={position.left + position.width}
				y={position.top}
			/>
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
	position: relative;

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
	background-color: ${colors.background};
	padding: 0.2rem 0.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 150%;
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
