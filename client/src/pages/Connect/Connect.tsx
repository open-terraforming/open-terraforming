import { Button } from '@/components'
import { Mars } from '@/components/Mars/Mars'
import { Modal } from '@/components/Modal/Modal'
import { useApi } from '@/context/ApiContext'
import { ApiState, setApiState } from '@/store/modules/api'
import { useAppStore } from '@/utils/hooks'
import React, { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { JoinGame } from './components/JoinGame'
import { GameStateValue } from '@shared/game'
import { JoinGameBySession } from './components/JoinGameBySession'

export const Connect = () => {
	const api = useApi()
	const dispatch = useDispatch()

	const apiState = useAppStore(state => state.api.state)
	const gameState = useAppStore(state => state.client.gameState)

	const handleReconnect = () => {
		dispatch(
			setApiState({
				state: ApiState.Connecting,
				error: undefined
			})
		)

		api.reconnect()
	}

	const content = useMemo(() => {
		switch (apiState) {
			case ApiState.Connecting: {
				return 'Connecting...'
			}

			case ApiState.Error: {
				return (
					<>
						<div>Connection failed</div>
						<Button onClick={handleReconnect}>Reconnect</Button>
					</>
				)
			}

			case ApiState.Connected: {
				return gameState === GameStateValue.WaitingForPlayers ? (
					<JoinGame />
				) : (
					<JoinGameBySession />
				)
			}
		}
	}, [apiState, gameState])

	return (
		<>
			<Mars />
			<Modal open={true} header="Join game" allowClose={false}>
				{content}
			</Modal>
		</>
	)
}
