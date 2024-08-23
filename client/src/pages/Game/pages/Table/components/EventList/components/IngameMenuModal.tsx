import { DialogWrapper, Button } from '@/components'
import { CardsViewer } from '@/components/CardsViewer/CardsViewer'
import { Modal } from '@/components/Modal/Modal'
import { SettingsModal } from '@/pages/Main/components/SettingsModal'
import { faCog, faSearch } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'

type Props = {
	onClose: () => void
}

export const IngameMenuModal = ({ onClose }: Props) => {
	return (
		<Modal header="Menu" open onClose={onClose}>
			<DialogWrapper dialog={close => <CardsViewer onClose={close} />}>
				{open => (
					<MenuButton icon={faSearch} onClick={open}>
						Cards Viewer
					</MenuButton>
				)}
			</DialogWrapper>
			<DialogWrapper dialog={close => <SettingsModal onClose={close} />}>
				{open => (
					<MenuButton icon={faCog} onClick={open}>
						Settings
					</MenuButton>
				)}
			</DialogWrapper>
		</Modal>
	)
}

const MenuButton = styled(Button)`
	display: block;
	width: 100%;
	box-sizing: border-box;
	margin: 0.25rem 0;
`
