import { Modal } from '@/components/Modal/Modal'
import { useApi } from '@/context/ApiContext'
import { useAppStore } from '@/utils/hooks'
import { Competition, Competitions } from '@shared/competitions'
import { COMPETITIONS_PRICES, COMPETITIONS_REWARDS } from '@shared/constants'
import { sponsorCompetition } from '@shared/index'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { ResourceIcon } from '../ResourceIcon/ResourceIcon'
import { CompetitionDisplay } from './components/CompetitionDisplay'
import { competitionPrice } from '@shared/utils'

type Props = {
	freePick?: boolean
	onClose: () => void
}

export const CompetitionsModal = ({ onClose, freePick }: Props) => {
	const api = useApi()
	const sponsored = useAppStore(state => state.game.state?.competitions) || []
	const players = useAppStore(state => state.game.state?.players) || []
	const playing = useAppStore(state => state.game.playing) || freePick
	const game = useAppStore(state => state.game.state)

	const competitionTypes = useAppStore(
		state => state.game.state.map.competitions
	)

	const playerMoney = useAppStore(state => state.game.player?.money) || 0

	const cost = competitionPrice(game)
	const affordable = !!freePick || (cost !== undefined && playerMoney >= cost)

	const handleBuy = (competition: Competition) => {
		if (affordable) {
			api.send(sponsorCompetition(competition.type))
		}
	}

	const competitions = useMemo(
		() => competitionTypes.map(c => Competitions[c]),
		[competitionTypes]
	)

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
					freePick={freePick}
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
