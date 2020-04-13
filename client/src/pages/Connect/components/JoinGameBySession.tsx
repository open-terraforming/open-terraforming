import React, { useState, useEffect } from 'react'
import { Input } from '@/components/Input/Input'
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { joinRequest } from '@shared/actions'
import { useApi } from '@/context/ApiContext'
import styled from 'styled-components'
import { Button } from '@/components'
import { useAppStore } from '@/utils/hooks'
import { Flex } from '@/components/Flex/Flex'
import { BackButton } from './BackButton'

type Props = {}

export const JoinGameBySession = ({}: Props) => {
	const api = useApi()
	const [joining, setJoining] = useState(false)
	const [session, setSession] = useState(localStorage['session'] || '')

	const apiState = useAppStore(state => state.api.state)
	const apiError = useAppStore(state => state.api.error)

	useEffect(() => {
		setJoining(false)
	}, [apiState, apiError])

	const handleConnect = () => {
		setJoining(true)

		api.send(joinRequest(undefined, session))
	}

	return (
		<>
			<Input
				value={session}
				onChange={v => setSession(v)}
				placeholder="Enter session"
				minLength={1}
			/>

			<Flex justify="space-between">
				<BackButton />
				<ConnectButton
					disabled={session.length < 1 || joining}
					onClick={handleConnect}
					isLoading={joining}
					icon={faArrowRight}
				>
					Connect
				</ConnectButton>
			</Flex>
		</>
	)
}

const ConnectButton = styled(Button)`
	margin: 0.5rem auto 0 auto;
`
