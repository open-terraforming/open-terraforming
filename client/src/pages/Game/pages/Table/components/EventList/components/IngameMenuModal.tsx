import { AboutModal } from '@/components/AboutModal/AboutModal'
import { CardsViewer } from '@/components/CardsViewer/CardsViewer'
import { DialogButton } from '@/components/DialogButton/DialogButton'
import { Modal } from '@/components/Modal/Modal'
import { SettingsModal } from '@/pages/Main/components/SettingsModal'
import { faCog, faInfo, faSearch } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'

type Props = {
	onClose: () => void
}

export const IngameMenuModal = ({ onClose }: Props) => {
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
		</Modal>
	)
}

const MenuButton = styled(DialogButton)`
	display: block;
	width: 100%;
	box-sizing: border-box;
	margin: 0.25rem 0;
`
