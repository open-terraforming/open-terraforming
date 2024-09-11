import { Modal } from '@/components/Modal/Modal'
import { useAppStore } from '@/utils/hooks'
import { ColonyDisplay } from './components/ColonyDisplay'

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
	const colonies = useAppStore((app) => app.game.state.colonies)

	return (
		<Modal header="Colonies" onClose={onClose} open>
			{colonies.map((colony, index) => (
				<ColonyDisplay
					key={colony.code}
					index={index}
					colony={colony}
					freeTradePick={freeTradePick}
					freeColonizePick={freeColonizePick}
					allowDuplicateColonies={allowDuplicateColonies}
					customAction={customAction}
				/>
			))}
		</Modal>
	)
}