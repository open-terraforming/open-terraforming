import { useAppStore } from '@/utils/hooks'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { saveAs } from 'file-saver'
import { Button } from '../Button/Button'
import { deepCopy } from '@shared/index'
import { ExportedGames } from '@/utils/types'
import { localGamesStore } from '@/utils/localGamesStore'

type Props = {
	className?: string
}

export const ExportSavedGamesButton = ({ className }: Props) => {
	const sessions = useAppStore((s) => s.client.sessions)

	const handleExport = () => {
		const data = deepCopy(sessions) as ExportedGames

		for (const [key, value] of Object.entries(data)) {
			if (key.startsWith('local/')) {
				const localData = localGamesStore.getGame(key.replace('local/', ''))

				if (localData) {
					value.local = localData
				} else {
					delete data[key]
				}
			}
		}

		saveAs(
			new Blob([JSON.stringify(data)], {
				type: 'application/json;charset=utf-8',
			}),
			`open-terraforming-sessions-${new Date().toISOString().split('T')[0]}.json`,
		)
	}

	return (
		<Button className={className} icon={faDownload} onClick={handleExport}>
			Export sessions
		</Button>
	)
}
