import { Button } from '@/components'
import { AboutModal } from '@/components/AboutModal/AboutModal'
import { CardsViewer } from '@/components/CardsViewer/CardsViewer'
import { DialogButton } from '@/components/DialogButton/DialogButton'
import { ExternalLink } from '@/components/ExternalLink/ExternalLink'
import { Modal } from '@/components/Modal/Modal'
import { SettingsModal } from '@/pages/Main/components/SettingsModal'
import { ApiState, setApiState } from '@/store/modules/api'
import { useAppDispatch } from '@/utils/hooks'
import {
	faChevronLeft,
	faCog,
	faInfo,
	faSearch,
} from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'

type Props = {
	onClose: () => void
}

export const IngameMenuModal = ({ onClose }: Props) => {
	const dispatch = useAppDispatch()

	const handleBack = () => {
		dispatch(
			setApiState({
				state: ApiState.Ready,
				gameId: null,
			}),
		)
	}

	return (
		<Modal header="Menu" open onClose={onClose}>
			<MenuButton
				dialog={(close) => <CardsViewer onClose={close} />}
				icon={faSearch}
			>
				Cards Viewer
			</MenuButton>
			<MenuButton
				dialog={(close) => <SettingsModal onClose={close} />}
				icon={faCog}
			>
				Settings
			</MenuButton>
			<MenuButton
				dialog={(close) => <AboutModal onClose={close} />}
				icon={faInfo}
			>
				About
			</MenuButton>

			<Button onClick={handleBack} icon={faChevronLeft}>
				Back to Main Menu
			</Button>

			<StyledLink href="https://github.com/open-terraforming/open-terraforming/issues/new?assignees=SkaceKamen&labels=bug&projects=&template=bug_report.md&title=">
				Report a bug
			</StyledLink>
		</Modal>
	)
}

const StyledLink = styled(ExternalLink)`
	width: 100%;
	display: flex;
	box-sizing: border-box;
	margin: 1.5rem 0 0.25rem 0;
	justify-content: center;
`

const MenuButton = styled(DialogButton)`
	display: block;
	width: 100%;
	box-sizing: border-box;
	margin: 0.25rem 0;
`
