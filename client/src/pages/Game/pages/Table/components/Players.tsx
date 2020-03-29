import React from 'react'
import { useAppStore } from '@/utils/hooks'
import { Player } from './Player'
import styled from 'styled-components'

export const Players = () => {
	const players = useAppStore(state => state.game.state?.players)

	return (
		<PlayersContainer>
			{players?.map(p => (
				<Player player={p} key={p.id} />
			))}
		</PlayersContainer>
	)
}

const PlayersContainer = styled.div`
	margin-top: 5rem;
`
