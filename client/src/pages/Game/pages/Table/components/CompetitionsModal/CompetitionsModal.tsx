import { Modal } from '@/components/Modal/Modal'
import { useApi } from '@/context/ApiContext'
import { useAppStore } from '@/utils/hooks'
import {
	Competition,
	Competitions,
	CompetitionType
} from '@shared/competitions'
import { COMPETITIONS_PRICES, COMPETITIONS_REWARDS } from '@shared/constants'
import { sponsorCompetition } from '@shared/index'
import React from 'react'
import styled from 'styled-components'
import { ResourceIcon } from '../ResourceIcon/ResourceIcon'
import { CompetitionDisplay } from './components/CompetitionDisplay'

type Props = {
	onClose: () => void
}

const competitions = [
	Competitions[CompetitionType.Landlord],
	Competitions[CompetitionType.Banker],
	Competitions[CompetitionType.Scientist],
	Competitions[CompetitionType.Thermalist],
	Competitions[CompetitionType.Miner]
]

export const CompetitionsModal = ({ onClose }: Props) => {
	const api = useApi()
	const sponsored = useAppStore(state => state.game.state?.competitions) || []
	const players = useAppStore(state => state.game.state?.players) || []
	const playing = useAppStore(state => state.game.playing)

	const playerMoney = useAppStore(state => state.game.player?.money) || 0

	const cost = COMPETITIONS_PRICES[sponsored.length]
	const affordable = cost !== undefined && playerMoney >= cost

	const handleBuy = (competition: Competition) => {
		if (affordable) {
			api.send(sponsorCompetition(competition.type))
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
					{COMPETITIONS_PRICES.map((p, i) => (
						<Flexed key={i}>
							<Index>{i + 1}.</Index> {p} <ResourceIcon res="money" />
						</Flexed>
					))}
				</Flexed>

				<Flexed>
					<span>Rewards:</span>
					{COMPETITIONS_REWARDS.map((p, i) => (
						<Flexed key={i}>
							<Index>{i + 1}.</Index> {p} VPs
						</Flexed>
					))}
				</Flexed>
			</Info>
			{competitions.map(c => (
				<CompetitionDisplay
					sponsored={players.find(
						p => p.id === sponsored.find(i => i.type === c.type)?.playerId
					)}
					cost={cost}
					playing={playing}
					competition={c}
					key={c.type}
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
