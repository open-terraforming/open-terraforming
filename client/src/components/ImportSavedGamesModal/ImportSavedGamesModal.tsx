import { setClientState } from '@/store/modules/client'
import { useAppDispatch, useAppStore } from '@/utils/hooks'
import { useState } from 'react'
import { Button } from '../Button/Button'
import { Modal } from '../Modal/Modal'

type Props = {
	onClose: () => void
}

export const ImportSavedGamesModal = ({ onClose }: Props) => {
	const currentSessions = useAppStore((s) => s.client.sessions)

	const dispatch = useAppDispatch()
	const [file, setFile] = useState<File>()

	const handleImport = async () => {
		const contents = await file?.text()

		if (!contents) {
			return
		}

		try {
			const importedSessions = JSON.parse(contents)

			dispatch(
				setClientState({
					sessions: {
						...currentSessions,
						...importedSessions,
					},
				}),
			)

			onClose()
		} catch (e) {
			console.error('Failed to parse contents', e)
			alert('Invalid file')
		}
	}

	return (
		<Modal
			onClose={onClose}
			open
			header="Import saved sessions"
			contentStyle={{ width: '20rem' }}
			footer={
				<Button onClick={handleImport} disabled={!file}>
					Import
				</Button>
			}
		>
			<input
				type="file"
				onChange={(e) => setFile(e.target.files?.[0] ?? undefined)}
			/>
		</Modal>
	)
}
