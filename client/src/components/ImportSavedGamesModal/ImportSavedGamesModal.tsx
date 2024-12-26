import { setClientState } from '@/store/modules/client'
import { useAppDispatch, useAppStore } from '@/utils/hooks'
import { localGamesStore } from '@/utils/localGamesStore'
import { ExportedGames } from '@/utils/types'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
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
			const importedSessions = JSON.parse(contents) as ExportedGames

			for (const [key, value] of Object.entries(importedSessions)) {
				if (key.startsWith('local/') && value.local) {
					localGamesStore.setGame(key.replace('local/', ''), {
						state: value.local.state,
						config: value.local.config,
					})
				}

				delete value.local
			}

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
				<Button onClick={handleImport} disabled={!file} icon={faUpload}>
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
