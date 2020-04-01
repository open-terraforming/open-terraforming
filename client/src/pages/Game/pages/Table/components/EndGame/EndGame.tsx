import React, { useMemo } from 'react'
import { useAppStore } from '@/utils/hooks'
import { PlayerState } from '@shared/index'
import { flatten } from '@/utils/collections'
import styled from 'styled-components'
import { Modal } from '@/components/Modal/Modal'
import { Button } from '@/components'

type Props = {
	onClose: () => void
}

export const EndGame = ({ onClose }: Props) => {
	const game = useAppStore(state => state.game.state)

	const chart = useMemo(
		() =>
			game
				? Object.entries(
						game.players.reduce((acc, player) => {
							const score = player.gameState.terraformRating

							if (!acc[score]) {
								acc[score] = []
							}

							acc[score].push(player)

							return acc
						}, {} as Record<number, PlayerState[]>)
				  )
						.sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
						.map(([, player]) => player)
				: [],
		[game]
	)

	return (
		<Modal
			header="Game ended"
			open={true}
			onClose={onClose}
			footer={<Button onClick={onClose}>Back to game</Button>}
		>
			<CharContainer>
				{chart.map((players, position) => (
					<Place
						key={position}
						style={{ fontSize: `${Math.max(100, 200 - position * 25)}%` }}
					>
						<span>{position + 1}.</span>
						<span>{players.map(p => p.name).join(', ')}</span>
						<span>({players[0].gameState.terraformRating})</span>
					</Place>
				))}
			</CharContainer>
		</Modal>
	)
}

const CharContainer = styled.div`
	text-align: center;
`

const Place = styled.div`
	margin: 0.5rem 0;
`
