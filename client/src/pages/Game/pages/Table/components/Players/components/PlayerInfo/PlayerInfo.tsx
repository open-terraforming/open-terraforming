import React, { useMemo } from 'react'
import { useAppStore } from '@/utils/hooks'
import { cardsToCardList } from '@/utils/cards'
import { Modal } from '@/components/Modal/Modal'
import { CardDisplay } from '../../../CardDisplay/CardDisplay'
import { Button } from '@/components'
import styled from 'styled-components'

type Props = {
	playerId: number
	onClose: () => void
}

export const PlayerInfo = ({ playerId, onClose }: Props) => {
	const player = useAppStore(state =>
		state.game.state?.players.find(p => p.id === playerId)
	)

	const state = player?.gameState

	const usedCards = player?.gameState.usedCards

	const cards = useMemo(() => (usedCards ? cardsToCardList(usedCards) : []), [
		usedCards
	])

	if (!player || !state) {
		return <>No player</>
	}

	return (
		<Modal
			open={true}
			onClose={onClose}
			header={`${player.name}`}
			contentStyle={{ width: '80%' }}
		>
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

			<CardDisplay
				cards={cards}
				onSelect={() => {
					void 0
				}}
				selected={[]}
			/>
		</Modal>
	)
}

const Info = styled.div`
	display: flex;
	padding: 0.2rem 0.5rem;
	flex-wrap: wrap;
`

const InfoItem = styled.div`
	margin: 0.25rem 1rem 0.25rem 0;
`
