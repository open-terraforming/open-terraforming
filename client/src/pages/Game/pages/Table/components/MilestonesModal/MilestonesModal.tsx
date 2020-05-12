import { Modal } from '@/components/Modal/Modal'
import { useApi } from '@/context/ApiContext'
import { range } from '@/utils/collections'
import { useAppStore, useGameState } from '@/utils/hooks'
import { buyMilestone } from '@shared/index'
import { Milestone, Milestones } from '@shared/milestones'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { ResourceIcon } from '../ResourceIcon/ResourceIcon'
import { MilestoneDisplay } from './components/MilestoneDisplay'

type Props = {
	onClose: () => void
}

export const MilestonesModal = ({ onClose }: Props) => {
	const api = useApi()
	const game = useGameState()
	const bought = game.milestones
	const players = game.players
	const playing = useAppStore(state => state.game.playing)
	const milestonesTypes = useAppStore(state => state.game.state.map.milestones)

	const playerMoney = useAppStore(state => state.game.player.money) || 0

	const affordable =
		bought.length < game.milestonesLimit && playerMoney >= game.milestonePrice

	const milestones = useMemo(() => milestonesTypes.map(m => Milestones[m]), [
		milestonesTypes
	])

	const handleBuy = (milestone: Milestone) => {
		if (affordable) {
			api.send(buyMilestone(milestone.type))
		}
	}

	return (
		<Modal
			open={true}
			header="Milestones"
			onClose={onClose}
			contentStyle={{ minWidth: '500px' }}
		>
			<Info>
				<Flexed>
					<span>Cost:</span>
					{range(0, 3).map(i => (
						<Flexed key={i}>
							<Index>{i + 1}.</Index> {game.milestonePrice}{' '}
							<ResourceIcon res="money" />
						</Flexed>
					))}
				</Flexed>

				<Flexed>
					<span>Reward:</span>
					<Flexed>{game.milestoneReward} VPs</Flexed>
				</Flexed>
			</Info>
			{milestones.map(c => (
				<MilestoneDisplay
					owner={players.find(
						p => p.id === bought.find(i => i.type === c.type)?.playerId
					)}
					cost={
						bought.length < game.milestonesLimit
							? game.milestonePrice
							: undefined
					}
					milestone={c}
					key={c.type}
					playing={playing}
					onBuy={handleBuy}
					canAfford={affordable}
				/>
			))}
		</Modal>
	)
}

const Info = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 0.5rem;
`

const Flexed = styled.div`
	display: flex;
	align-items: center;

	> * {
		margin: 0 0.25rem;
	}
`

const Index = styled.div`
	color: #ccc;
`
