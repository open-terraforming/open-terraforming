import React, { useState, useEffect } from 'react'
import { useApi, useAppStore } from '@/utils/hooks'
import { Button } from '@/components'
import { handshakeRequest, VERSION } from '@shared/index'
import { Container } from '@/components/Container'
import { useDispatch } from 'react-redux'
import { setApiState } from '@/store/modules/api'

export const Connect = () => {
	const api = useApi()
	const dispatch = useDispatch()

	const [name, setName] = useState('')
	const [initializing, setInitializing] = useState(false)
	const connected = useAppStore(state => state.api.connected)
	const reconnecting = useAppStore(state => state.api.reconnecting)
	const failed = useAppStore(state => state.api.failed)
	const session = useAppStore(state => state.client.session)

	const handleReconnect = () => {
		dispatch(
			setApiState({
				reconnecting: true,
				failed: false
			})
		)

		api.reconnect()
	}

	const handleConnect = () => {
		setInitializing(true)
		api.send(handshakeRequest(VERSION, name, session))
	}

	useEffect(() => {
		setInitializing(false)
	}, [reconnecting, connected])

	return (
		<Container>
			{failed ? (
				<>
					<div>Connecting failed</div>
					<Button onClick={handleReconnect}>Reconnect</Button>
				</>
			) : reconnecting ? (
				'Reconnecting ...'
			) : initializing ? (
				'Waiting for server...'
			) : (
				<>
					{!connected && 'Connecting....'}
					{connected && (
						<>
							<input
								type="text"
								value={name}
								onChange={e => setName(e.target.value)}
							/>
							<Button onClick={handleConnect}>Connect</Button>
						</>
					)}
				</>
			)}
		</Container>
	)
}
