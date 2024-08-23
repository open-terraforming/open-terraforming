import { Modal } from '@/components/Modal/Modal'
import { GamesList } from './GamesList'

type Props = {
	onClose: () => void
}

export const GamesListModal = ({ onClose }: Props) => {
	return (
		<Modal open={true} onClose={onClose} header="Server list">
			<GamesList />
		</Modal>
	)
}
