import { Modal } from '@/components/Modal/Modal'
import { StandardProjectsList } from './components/StandardProjectsList'

type Props = {
	onClose: () => void
}

export const StandardProjectModal = ({ onClose }: Props) => {
	return (
		<Modal
			contentStyle={{ minWidth: '600px' }}
			open={true}
			header={'Standard projects'}
			onClose={onClose}
		>
			<StandardProjectsList onClose={onClose} />
		</Modal>
	)
}
