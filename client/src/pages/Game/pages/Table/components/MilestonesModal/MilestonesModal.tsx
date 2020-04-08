import { Button } from '@/components'
import { Modal } from '@/components/Modal/Modal'
import { useApi } from '@/context/ApiContext'
import { range } from '@/utils/collections'
import { useAppStore } from '@/utils/hooks'
import {
	MILESTONES_LIMIT,
	MILESTONE_PRICE,
	MILESTONE_REWARD
} from '@shared/constants'
import { buyMilestone } from '@shared/index'
import { Milestone, Milestones, MilestoneType } from '@shared/milestones'
import React from 'react'
import styled from 'styled-components'
import { ResourceIcon } from '../ResourceIcon/ResourceIcon'
import { MilestoneDisplay } from './components/MilestoneDisplay'

type Props = {
	onClose: () => void
	playing: boolean
}

const milestones = [
	Milestones[MilestoneType.Terraformer],
	Milestones[MilestoneType.Mayor],
	Milestones[MilestoneType.Gardener],
	Milestones[MilestoneType.Builder],
	Milestones[MilestoneType.Planner]
]

export const MilestonesModal = ({ onClose, playing }: Props) => {
	const api = useApi()
	const bought = useAppStore(state => state.game.state?.milestones) || []
	const players = useAppStore(state => state.game.state?.players) || []

	const playerMoney =
		useAppStore(state => state.game.player?.money) || 0

	const affordable =
		bought.length < MILESTONES_LIMIT && playerMoney >= MILESTONE_PRICE

	const handleBuy = (milestone: Milestone) => {
		if (affordable) {
			api.send(buyMilestone(milestone.type))
		}
	}

	return (
		<Modal
			open={true}
			header="Competitions"
			onClose={onClose}
			contentStyle={{ width: '500px' }}
		>
			<Info>
				<Flexed>
					<span>Cost:</span>
					{range(0, 3).map(i => (
						<Flexed key={i}>
							<Index>{i + 1}.</Index> {MILESTONE_PRICE}{' '}
							<ResourceIcon res="money" />
						</Flexed>
					))}
				</Flexed>

				<Flexed>
					<span>Reward:</span>
					<Flexed>{MILESTONE_REWARD} VPs</Flexed>
				</Flexed>
			</Info>
			{milestones.map(c => (
				<MilestoneDisplay
					owner={players.find(
						p => p.id === bought.find(i => i.type === c.type)?.playerId
					)}
					cost={bought.length < MILESTONES_LIMIT ? MILESTONE_PRICE : undefined}
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
