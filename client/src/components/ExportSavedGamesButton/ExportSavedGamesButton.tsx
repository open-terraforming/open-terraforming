import { localGamesStore } from '@/utils/localGamesStore'
import { localSessionsStore } from '@/utils/localSessionsStore'
import { ExportedGames } from '@/utils/types'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { deepCopy } from '@shared/index'
import { saveAs } from 'file-saver'
import { Button } from '../Button/Button'

type Props = {
	className?: string
}

export const ExportSavedGamesButton = ({ className }: Props) => {
	const handleExport = () => {
		const data = deepCopy(localSessionsStore.sessions) as ExportedGames

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
