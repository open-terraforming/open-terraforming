import { MinimizeIcon } from '@/components/MinimizeIcon'
import { Modal } from '@/components/Modal/Modal'
import { ColoniesList } from './components/ColoniesList'

type Props = {
	freeTradePick?: boolean
	freeColonizePick?: boolean
	allowDuplicateColonies?: boolean
	disableClose?: boolean
	closeAsMinimize?: boolean
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
	disableClose,
	closeAsMinimize,
	onClose,
}: Props) => {
	return (
		<Modal
			header="Colonies"
			onClose={onClose}
			open
			hideClose={disableClose}
			closeIcon={closeAsMinimize ? <MinimizeIcon /> : undefined}
		>
			<ColoniesList
				freeTradePick={freeTradePick}
				freeColonizePick={freeColonizePick}
				allowDuplicateColonies={allowDuplicateColonies}
				customAction={customAction}
			/>
		</Modal>
	)
}
