import React from 'react'
import { PlayerState, PlayerStateValue } from '@shared/index'
import styled from 'styled-components'
import { useAppStore } from '@/utils/hooks'

export const Player = ({ player }: { player: PlayerState }) => {
	const state = player?.gameState

	const hasPassed = state.state === PlayerStateValue.Passed
	const isPlaying = state.state === PlayerStateValue.Playing

	const isPlayer = player.id === useAppStore(state => state.game.playerId)

	return (
		<Container>
			<NameContainer>
				<Name>
					{player.name}
					{isPlayer ? ' (You)' : ''}
				</Name>
				<Rating>{state.terraformRating}</Rating>
				<State>
					{isPlaying
						? `Action ${state.actionsPlayed} of 2`
						: hasPassed
						? 'Passed'
						: ''}
				</State>
			</NameContainer>
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
			</Info>
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
`

const Rating = styled.div`
	margin-left: 1rem;
	padding: 0.2rem 0.5rem;
`

const State = styled.div`
	margin-left: 1rem;
	background-color: rgba(14, 129, 214, 0.8);
	padding: 0.2rem 0.5rem;
`

const Info = styled.div`
	display: flex;
	padding: 0.2rem 0.5rem;
`

const InfoItem = styled.div`
	margin-right: 1rem;
`
