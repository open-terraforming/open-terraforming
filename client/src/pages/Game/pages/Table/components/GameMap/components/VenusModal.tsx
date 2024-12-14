import { Modal } from '@/components/Modal/Modal'
import { useApi } from '@/context/ApiContext'
import { setTableState } from '@/store/modules/table'
import { useAppDispatch, useAppStore } from '@/utils/hooks'
import { placeTile } from '@shared/actions'
import { GridCell } from '@shared/index'
import { PlacementState } from '@shared/placements'
import { VenusProgress } from '../../GlobalState/components/VenusProgress'
import { VenusMap } from './VenusMap'

type Props = {
	open: boolean
	onClose: () => void
	placing?: PlacementState
}

export const VenusModal = ({ open, onClose, placing }: Props) => {
	const dispatch = useAppDispatch()

	const game = useAppStore((state) => state.game.state)
	const api = useApi()

	const pickingCellForBuyArg = useAppStore(
		(state) => state.table.pickingCellForBuyArg,
	)

	const handleCellClick = (cell: GridCell) => {
		if (pickingCellForBuyArg) {
			pickingCellForBuyArg.onPick(cell.x, cell.y, cell.location ?? null)
			dispatch(setTableState({ pickingCellForBuyArg: undefined }))
			onClose()

			return
		}

		if (placing) {
			api.send(placeTile(cell.x, cell.y, cell.location))
		}
	}

	return (
		<Modal open={open} onClose={onClose} header="Venus" allowClose>
			<VenusProgress
				start={game.map.initialVenus}
				current={game.venus}
				target={game.map.venus}
				milestones={game.map.venusMilestones}
			/>
			<VenusMap onCellClick={handleCellClick} placing={placing} />
		</Modal>
	)
}
