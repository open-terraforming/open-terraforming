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
import { faArrowLeft, faSync, faRedo } from '@fortawesome/free-solid-svg-icons'
import { Flex } from '@/components/Flex/Flex'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BackButton } from './components/BackButton'

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
				return (
					<>
						<Message>
							<FontAwesomeIcon icon={faSync} spin /> Connecting...
						</Message>
						<BackButton />
					</>
				)
			}

			case ApiState.Error: {
				return (
					<>
						<Message>Connection failed</Message>
						<Flex justify="space-between">
							<BackButton />
							<Button onClick={handleReconnect} icon={faRedo}>
								Retry
							</Button>
						</Flex>
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

const Message = styled.div`
	margin: 1rem 0 2rem 0;
	min-width: 15rem;
`
