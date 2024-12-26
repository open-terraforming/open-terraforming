import { Modal } from '@/components/Modal/Modal'
import { useState } from 'react'
import { NewGameModal } from './NewGameModal'
import { Button } from '@/components'

type Props = {
	onClose: () => void
}

enum NewGameMode {
	Local = 'local',
	Online = 'online',
}

export const NewGamePickerModal = ({ onClose }: Props) => {
	const [mode, setMode] = useState<NewGameMode>()

	return (
		<>
			<Modal open={mode === undefined} onClose={onClose}>
				<Button onClick={() => setMode(NewGameMode.Local)}>Local</Button>
				<Button onClick={() => setMode(NewGameMode.Online)}>Online</Button>
			</Modal>
			{mode === NewGameMode.Local && <NewGameModal onClose={onClose} local />}
			{mode === NewGameMode.Online && <NewGameModal onClose={onClose} />}
		</>
	)
}
