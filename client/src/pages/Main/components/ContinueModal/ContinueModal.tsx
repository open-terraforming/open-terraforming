import { Box } from '@/components/Box'
import { DialogButton } from '@/components/DialogButton/DialogButton'
import { ExportSavedGamesButton } from '@/components/ExportSavedGamesButton/ExportSavedGamesButton'
import { ImportSavedGamesModal } from '@/components/ImportSavedGamesModal/ImportSavedGamesModal'
import { Modal } from '@/components/Modal/Modal'
import { TabsContent } from '@/components/TabsContent'
import { TabsHead } from '@/components/TabsHead'
import { useAppStore } from '@/utils/hooks'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { partition } from '@shared/utils'
import { darken } from 'polished'
import { useMemo, useState } from 'react'
import styled, { useTheme } from 'styled-components'
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

	const sessions = useAppStore((state) => state.client.sessions)
	const theme = useTheme()

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
				backgroundColor: darken(0.05, theme.colors.background),
			}}
		>
			<TabsHead tab={tab} setTab={setTab} tabs={tabs} />

			<TabsContent tab={tab} tabs={tabs} />

			{Object.keys(sessions).length > 0 && (
				<BottomBox>
					<Spitter />
					<Box $mb={4} justify="center" gap="0.5rem">
						<ExportSavedGamesButton />
						<DialogButton
							dialog={(onClose) => <ImportSavedGamesModal onClose={onClose} />}
							icon={faUpload}
						>
							Import sessions
						</DialogButton>
					</Box>
				</BottomBox>
			)}
		</Modal>
	)
}

const Spitter = styled.div`
	background-color: ${({ theme }) => darken(0.05, theme.colors.border)};
	height: 2px;
	margin: 0 0 1rem 0;
`

const BottomBox = styled.div`
	flex-grow: 0;
	flex-shrink: 0;
`
