import { Box } from '@/components/Box'
import { DialogButton } from '@/components/DialogButton/DialogButton'
import { ExportSavedGamesButton } from '@/components/ExportSavedGamesButton/ExportSavedGamesButton'
import { ImportSavedGamesModal } from '@/components/ImportSavedGamesModal/ImportSavedGamesModal'
import { Modal } from '@/components/Modal/Modal'
import { TabsContent } from '@/components/TabsContent'
import { TabsHead } from '@/components/TabsHead'
import { localSessionsStore } from '@/utils/localSessionsStore'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { partition } from '@shared/utils'
import { useMemo, useState } from 'react'
import { SavedGamesList } from './components/SavedGamesList'

type Props = {
	onClose: () => void
}

enum Tabs {
	All = 1,
	Online,
	Local,
}

export const ContinueModal = ({ onClose }: Props) => {
	const [tab, setTab] = useState(Tabs.All)
	const sessions = localSessionsStore.use()

	const tabs = useMemo(() => {
		const all = Object.entries(sessions)

		const [local, online] = partition(all, ([key]) => key.startsWith('local/'))

		return [
			{
				title: 'All',
				key: Tabs.All,
				content: <SavedGamesList games={all} />,
			},
			{
				title: 'Online',
				key: Tabs.Online,
				content: <SavedGamesList games={online} />,
			},
			{
				title: 'Local',
				key: Tabs.Local,
				content: <SavedGamesList games={local} />,
			},
		]
	}, [sessions])

	return (
		<Modal
			onClose={onClose}
			open
			header="Continue"
			bodyStyle={{
				padding: 0,
				display: 'flex',
				flexDirection: 'column',
				overflow: 'auto',
			}}
			headerStyle={{
				borderBottom: 'none',
			}}
			footer={
				Object.keys(sessions).length > 0 && (
					<Box justify="center" gap="0.5rem">
						<ExportSavedGamesButton />
						<DialogButton
							dialog={(onClose) => <ImportSavedGamesModal onClose={onClose} />}
							icon={faUpload}
						>
							Import sessions
						</DialogButton>
					</Box>
				)
			}
		>
			<TabsHead tab={tab} setTab={setTab} tabs={tabs} />

			<TabsContent tab={tab} tabs={tabs} />
		</Modal>
	)
}
