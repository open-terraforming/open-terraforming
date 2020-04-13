import { Button } from '@/components'
import { Flex } from '@/components/Flex/Flex'
import { Input } from '@/components/Input/Input'
import { useApi } from '@/context/ApiContext'
import { useAppStore } from '@/utils/hooks'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { joinRequest } from '@shared/actions'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { BackButton } from './BackButton'

type Props = {}

export const JoinGameBySession = ({}: Props) => {
	const api = useApi()
	const [joining, setJoining] = useState(false)
	const [session, setSession] = useState('')

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

			<ConnectButtons justify="space-between">
				<BackButton />
				<Button
					disabled={session.length < 1 || joining}
					onClick={handleConnect}
					isLoading={joining}
					icon={faArrowRight}
				>
					Connect
				</Button>
			</ConnectButtons>
		</>
	)
}

const ConnectButtons = styled(Flex)`
	margin: 0.5rem auto 0 auto;
`
