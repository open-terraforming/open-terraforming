import { Button } from '@/components'
import { Box } from '@/components/Box'
import { Flex } from '@/components/Flex/Flex'
import { ApiState, setApiState } from '@/store/modules/api'
import { SavedSessionInfo, setClientState } from '@/store/modules/client'
import { useAppDispatch, useAppStore } from '@/utils/hooks'
import {
	extractGameIdFromLocal,
	localGamesStore,
} from '@/utils/localGamesStore'
import { numberWithSuffix } from '@/utils/numberWithSuffix'
import { faPlay, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useMemo } from 'react'
import styled from 'styled-components'

type Props = {
	games: [id: string, session: SavedSessionInfo][]
}

export const SavedGamesList = ({ games }: Props) => {
	const sessions = useAppStore((state) => state.client.sessions)
	const dispatch = useAppDispatch()

	const handleRemove = (id: string) => () => {
		if (confirm('Are you sure you want to forget this game?')) {
			delete sessions[id]

			dispatch(setClientState({ sessions: { ...sessions } }))

			if (id.startsWith('local/')) {
				localGamesStore.removeGame(extractGameIdFromLocal(id))
			}
		}
	}

	const handleJoin = (id: string) => () => {
		dispatch(
			setApiState({
				state: ApiState.Connecting,
				gameId: id,
			}),
		)
	}

	const sessionsItems = useMemo(
		() => games.slice().sort(([, a], [, b]) => b.lastUpdateAt - a.lastUpdateAt),
		[games],
	)

	return (
		<Box $p={2} direction="column" align="stretch" gap="0.25rem">
			{sessionsItems.map(([id, session]) => (
				<GameItem key={id}>
					<Button icon={faTrash} onClick={handleRemove(id)}></Button>
					<Info>
						<div>{session.name || '<<No name>>'}</div>
						<InfoLine gap="0.25rem">
							<div>{numberWithSuffix(session.generation)} generation</div>
							<Box $ml="auto">
								{new Date(session.lastUpdateAt).toLocaleString(undefined, {
									dateStyle: 'medium',
									timeStyle: 'short',
								})}
							</Box>
						</InfoLine>
					</Info>
					<Button icon={faPlay} onClick={handleJoin(id)}>
						Join
					</Button>
				</GameItem>
			))}
		</Box>
	)
}

const GameItem = styled(Flex)`
	gap: 1rem;
	align-items: center;
`

const Info = styled.div`
	flex: 1;
`

const InfoLine = styled(Flex)`
	align-items: center;
	opacity: 0.8;
	margin-top: 0.2rem;
`
