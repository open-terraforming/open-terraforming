import { Modal } from '@/components/Modal/Modal'
import { useAppStore } from '@/utils/hooks'
import { ColonyDisplay } from './components/ColonyDisplay'

type Props = {
	onClose: () => void
}

export const ColoniesModal = ({ onClose }: Props) => {
	const colonies = useAppStore((app) => app.game.state.colonies)

	return (
		<Modal header="Colonies" onClose={onClose} open>
			{colonies.map((colony, index) => (
				<ColonyDisplay key={colony.code} index={index} colony={colony} />
			))}
		</Modal>
	)
}
