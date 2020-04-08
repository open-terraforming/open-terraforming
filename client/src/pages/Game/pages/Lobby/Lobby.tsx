import { Button } from '@/components'
import { Container } from '@/components/Container'
import { Mars } from '@/components/Mars/Mars'
import { useApi } from '@/context/ApiContext'
import { useAppStore } from '@/utils/hooks'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { playerReady, PlayerStateValue } from '@shared/index'
import React from 'react'
import styled from 'styled-components'
import { Player } from './components/Player'

export const Lobby = () => {
	const api = useApi()
	const players = useAppStore(state => state.game.state?.players)
	const player = useAppStore(state => state.game.player)
	const isReady = player?.state === PlayerStateValue.Ready

	const handleReady = () => {
		api.send(playerReady(!isReady))
	}

	return (
		<Container header="Waiting for players">
			{players?.map(p => (
				<Player
					name={p.name}
					key={p.id}
					ready={p.state === PlayerStateValue.Ready}
				/>
			))}

			<Ready onClick={handleReady} icon={isReady ? faTimes : faCheck}>
				{isReady ? 'Not ready' : 'Ready'}
			</Ready>

			<Mars />
		</Container>
	)
}

const Ready = styled(Button)`
	margin: 1rem auto 0 auto;
`
