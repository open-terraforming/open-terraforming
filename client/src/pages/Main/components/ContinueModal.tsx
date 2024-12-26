import { Button } from '@/components'
import { DialogButton } from '@/components/DialogButton/DialogButton'
import { ExportSavedGamesButton } from '@/components/ExportSavedGamesButton/ExportSavedGamesButton'
import { Flex } from '@/components/Flex/Flex'
import { ImportSavedGamesModal } from '@/components/ImportSavedGamesModal/ImportSavedGamesModal'
import { Modal } from '@/components/Modal/Modal'
import { ApiState, setApiState } from '@/store/modules/api'
import { setClientState } from '@/store/modules/client'
import { useAppDispatch, useAppStore } from '@/utils/hooks'
import {
	extractGameIdFromLocal,
	localGamesStore,
} from '@/utils/localGamesStore'
import { faPlay, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons'
import { darken } from 'polished'
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

			{Object.keys(sessions).length > 0 && (
				<>
					<Spitter />
					<Flex justify="center" gap="0.5rem">
						<ExportSavedGamesButton />
						<DialogButton
							dialog={(onClose) => <ImportSavedGamesModal onClose={onClose} />}
							icon={faUpload}
						>
							Import sessions
						</DialogButton>
					</Flex>
				</>
			)}
		</Modal>
	)
}

const Spitter = styled.div`
	background-color: ${({ theme }) => darken(0.05, theme.colors.border)};
	height: 2px;
	margin: 1.5rem 0 1rem 0;
`

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
