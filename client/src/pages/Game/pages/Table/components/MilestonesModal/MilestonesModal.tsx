import { Modal } from '@/components/Modal/Modal'
import { MilestonesDisplay } from './components/MilestonesDisplay'

type Props = {
	onClose: () => void
}

export const MilestonesModal = ({ onClose }: Props) => {
	return (
		<Modal
			open={true}
			header="Milestones"
			onClose={onClose}
			contentStyle={{ minWidth: '500px' }}
		>
			<MilestonesDisplay />
		</Modal>
	)
}
