import { Modal } from '@/components/Modal/Modal'
import { MinimizeIcon } from '../../../../../../components/MinimizeIcon'
import { CompetitionsList } from './components/CompetitionsList'

type Props = {
	freePick?: boolean
	closeAsMinimize?: boolean
	onClose: () => void
}

export const CompetitionsModal = ({
	onClose,
	freePick,
	closeAsMinimize,
}: Props) => {
	return (
		<Modal
			open={true}
			header="Competitions"
			onClose={onClose}
			closeIcon={closeAsMinimize ? <MinimizeIcon /> : undefined}
			contentStyle={{ minWidth: '500px' }}
		>
			<CompetitionsList freePick={freePick} />
		</Modal>
	)
}
