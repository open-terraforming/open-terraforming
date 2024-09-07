import { useAppStore } from '@/utils/hooks'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { saveAs } from 'file-saver'
import { Button } from '../Button/Button'

type Props = {
	className?: string
}

export const ExportSavedGamesButton = ({ className }: Props) => {
	const sessions = useAppStore((s) => s.client.sessions)

	const handleExport = () => {
		saveAs(
			new Blob([JSON.stringify(sessions)], {
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
