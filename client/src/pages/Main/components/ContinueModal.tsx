import { Button } from '@/components'
import { Flex } from '@/components/Flex/Flex'
import { Modal } from '@/components/Modal/Modal'
import { ApiState, setApiState } from '@/store/modules/api'
import { setClientState } from '@/store/modules/client'
import { useAppDispatch, useAppStore } from '@/utils/hooks'
import { faPlay, faTrash } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'

type Props = {
	onClose: () => void
}

export const ContinueModal = ({ onClose }: Props) => {
	const sessions = useAppStore((state) => state.client.sessions)
	const dispatch = useAppDispatch()

	const handleRemove = (id: string) => () => {
		if (confirm('Are you sure you want to forget this game?')) {
			delete sessions[id]

			dispatch(setClientState({ sessions: { ...sessions } }))
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

	return (
		<Modal onClose={onClose} open header="Continue">
			{Object.entries(sessions).map(([id, session]) => (
				<GameItem key={id}>
					<Button icon={faTrash} onClick={handleRemove(id)}></Button>
					<Info>
						<div>{session.name}</div>
						<InfoLine>
							{new Date(session.lastUpdateAt).toLocaleString(undefined, {
								dateStyle: 'medium',
								timeStyle: 'short',
							})}
							{' - '}Generation {session.generation}
						</InfoLine>
					</Info>
					<Button icon={faPlay} onClick={handleJoin(id)}>
						Join
					</Button>
				</GameItem>
			))}
		</Modal>
	)
}

const GameItem = styled(Flex)`
	gap: 1rem;
	margin: 1rem 0;
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
