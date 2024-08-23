import { Button } from '@/components'
import { Flex } from '@/components/Flex/Flex'
import { Input } from '@/components/Input/Input'
import { useApi } from '@/context/ApiContext'
import { useAppStore } from '@/utils/hooks'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { joinRequest } from '@shared/actions'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { BackButton } from './BackButton'

export const JoinGame = () => {
	const api = useApi()
	const [joining, setJoining] = useState(false)
	const [name, setName] = useState(localStorage['lastName'] || '')

	const apiState = useAppStore((state) => state.api.state)
	const apiError = useAppStore((state) => state.api.error)

	useEffect(() => {
		setJoining(false)
	}, [apiState, apiError])

	const handleConnect = () => {
		setJoining(true)

		localStorage['lastName'] = name
		api.send(joinRequest(name))
	}

	return (
		<>
			<Input
				value={name}
				onChange={(v) => setName(v)}
				placeholder="Enter your name"
				minLength={3}
				maxLength={10}
			/>

			<ConnectButtons justify="space-between">
				<BackButton />

				<Button
					disabled={name.length < 3 || name.length > 10 || joining}
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
