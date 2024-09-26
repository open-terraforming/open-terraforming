import { Modal } from '@/components/Modal/Modal'
import { CompetitionsList } from './components/CompetitionsList'

type Props = {
	freePick?: boolean
	onClose: () => void
}

export const CompetitionsModal = ({ onClose, freePick }: Props) => {
	return (
		<Modal
			open={true}
			header="Competitions"
			onClose={onClose}
			contentStyle={{ minWidth: '500px' }}
		>
			<CompetitionsList freePick={freePick} />
		</Modal>
	)
}
