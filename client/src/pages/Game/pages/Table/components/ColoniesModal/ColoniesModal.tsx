import { Modal } from '@/components/Modal/Modal'
import { ColoniesList } from './components/ColoniesList'

type Props = {
	freeTradePick?: boolean
	freeColonizePick?: boolean
	allowDuplicateColonies?: boolean
	customAction?: (colonyIndex: number) => {
		enabled: boolean
		perform: () => void
		label: string
	}
	onClose: () => void
}

export const ColoniesModal = ({
	freeTradePick,
	freeColonizePick,
	allowDuplicateColonies,
	customAction,
	onClose,
}: Props) => {
	return (
		<Modal header="Colonies" onClose={onClose} open>
			<ColoniesList
				freeTradePick={freeTradePick}
				freeColonizePick={freeColonizePick}
				allowDuplicateColonies={allowDuplicateColonies}
				customAction={customAction}
			/>
		</Modal>
	)
}
