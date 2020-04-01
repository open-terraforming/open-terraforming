import React from 'react'
import { PlayerState, PlayerStateValue } from '@shared/index'
import styled from 'styled-components'
import { useAppStore } from '@/utils/hooks'
import { Tooltip } from '@/components'

const stateToStr = {
	[PlayerStateValue.Passed]: 'Passed',
	[PlayerStateValue.Playing]: 'Playing',
	[PlayerStateValue.WaitingForTurn]: 'Waiting',
	[PlayerStateValue.PickingCards]: 'Picking cards',
	[PlayerStateValue.PickingCorporation]: 'Picking corporation',
	[PlayerStateValue.Connecting]: 'Connecting',
	[PlayerStateValue.Waiting]: null,
	[PlayerStateValue.Ready]: null,
	[PlayerStateValue.PlacingTile]: 'Placing tile'
} as const

export const Player = ({ player }: { player: PlayerState }) => {
	const state = player?.gameState

	const isPlaying = state.state === PlayerStateValue.Playing

	const isPlayer = player.id === useAppStore(state => state.game.playerId)

	return (
		<Container>
			<Tooltip
				content={
					<Info>
						<InfoItem>
							{state.money}/{state.moneyProduction} $
						</InfoItem>
						<InfoItem>
							Ore: {state.ore} / {state.oreProduction}{' '}
						</InfoItem>
						<InfoItem>
							Titan: {state.titan} / {state.titanProduction}
						</InfoItem>
						<InfoItem>
							Plants: {state.plants} / {state.plantsProduction}
						</InfoItem>
						<InfoItem>
							Energy: {state.energy} / {state.energyProduction}
						</InfoItem>
						<InfoItem>
							Heat: {state.heat} / {state.heatProduction}
						</InfoItem>
						<InfoItem>Cards in hand: {state.cards.length}</InfoItem>
						<InfoItem>Cards on table: {state.usedCards.length}</InfoItem>
					</Info>
				}
			>
				<NameContainer>
					<Name>
						{player.name}
						{isPlayer ? ' (You)' : ''}
					</Name>
					<Rating>{state.terraformRating}</Rating>
				</NameContainer>
				<State>
					{isPlaying
						? `Action ${state.actionsPlayed} of 2`
						: stateToStr[state.state] || PlayerStateValue[state.state]}
				</State>
			</Tooltip>
		</Container>
	)
}

const NameContainer = styled.div`
	display: flex;
	align-items: center;
`

const Container = styled.div`
	margin-bottom: 1rem;
	background-color: rgba(14, 129, 214, 0.8);
`

const Name = styled.div`
	background-color: rgba(14, 129, 214, 0.8);
	padding: 0.2rem 0.5rem;
	flex-grow: 1;
`

const Rating = styled.div`
	padding: 0.2rem 0.5rem;
`

const State = styled.div`
	padding: 0.2rem 0.5rem;
`

const Info = styled.div`
	display: flex;
	padding: 0.2rem 0.5rem;
	max-width: 300px;
	flex-wrap: wrap;
`

const InfoItem = styled.div`
	margin: 0.25rem 1rem 0.25rem 0;
`
