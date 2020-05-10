import { Button } from '@/components'
import { Flex } from '@/components/Flex/Flex'
import { Input } from '@/components/Input/Input'
import { useApi } from '@/context/ApiContext'
import { useAppStore } from '@/utils/hooks'
import {
	faArrowRight,
	faArrowLeft,
	faEye
} from '@fortawesome/free-solid-svg-icons'
import { joinRequest, spectateRequest } from '@shared/actions'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { BackButton } from './BackButton'

type Props = {}

export const JoinGameBySession = ({}: Props) => {
	const api = useApi()
	const [joining, setJoining] = useState(false)
	const [session, setSession] = useState('')
	const [useSession, setUseSession] = useState(false)

	const apiState = useAppStore(state => state.api.state)
	const apiError = useAppStore(state => state.api.error)
	const gameInfo = useAppStore(state => state.client.info)

	useEffect(() => {
		setJoining(false)
	}, [apiState, apiError])

	const handleConnect = () => {
		setJoining(true)

		api.send(joinRequest(undefined, session))
	}

	const handleSession = () => {
		setUseSession(true)
	}

	const handleBack = () => {
		setUseSession(false)
	}

	const handleSpectate = () => {
		api.send(spectateRequest())
	}

	return (
		<>
			{useSession ? (
				<>
					<Input
						value={session}
						onChange={v => setSession(v)}
						placeholder="Enter session"
						minLength={1}
					/>

					<ConnectButtons justify="space-between">
						<Button
							onClick={handleBack}
							icon={faArrowLeft}
							schema="transparent"
						>
							Back
						</Button>

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
			) : (
				<>
					<Text>Game is already running.</Text>
					<ConnectButtons justify="space-between">
						<BackButton />
						<Button onClick={handleSession}>Join using session</Button>
						{gameInfo?.spectatorsEnabled && (
							<Button onClick={handleSpectate} icon={faEye}>
								Spectate
							</Button>
						)}
					</ConnectButtons>
				</>
			)}
		</>
	)
}

const ConnectButtons = styled(Flex)`
	margin: 0.5rem auto 0 auto;

	> button {
		margin-left: 1rem;
	}
`

const Text = styled.div`
	margin: 1.5rem 0 2rem 0;
`
