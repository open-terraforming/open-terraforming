import React, { useState, useEffect } from 'react'
import { useAppStore } from '@/utils/hooks'
import { Button } from '@/components'
import { handshakeRequest, VERSION } from '@shared/index'
import { Container } from '@/components/Container'
import { useDispatch } from 'react-redux'
import { setApiState } from '@/store/modules/api'
import { useApi } from '@/context/ApiContext'

export const Connect = () => {
	const api = useApi()
	const dispatch = useDispatch()

	const [name, setName] = useState(localStorage['lastName'] || '')
	const [initializing, setInitializing] = useState(false)
	const connected = useAppStore(state => state.api.connected)
	const reconnecting = useAppStore(state => state.api.reconnecting)
	const failed = useAppStore(state => state.api.failed)
	const error = useAppStore(state => state.api.error)
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
		localStorage['lastName'] = name
		api.send(handshakeRequest(VERSION, name, session))
	}

	useEffect(() => {
		setInitializing(false)
	}, [reconnecting, connected, error])

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
								onKeyUp={e => {
									if (e.key === 'Enter') {
										handleConnect()
									}
								}}
								autoFocus
							/>
							<Button onClick={handleConnect}>Connect</Button>
						</>
					)}
				</>
			)}
		</Container>
	)
}
