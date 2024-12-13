import { Button } from '@/components'
import { setTableState } from '@/store/modules/table'
import { useAppDispatch } from '@/utils/hooks'
import { CardEffectArgument } from '@shared/cards'
import { GridCellLocation } from '@shared/gameState'
import { useRef } from 'react'
import { TileIcon } from '../../TileIcon/TileIcon'
import { ArgContainer } from './ArgContainer'

type Props = {
	arg: CardEffectArgument
	onChange: (
		v: [x: number, y: number, location: GridCellLocation | null],
	) => void
}

export const TileArg = ({ arg, onChange }: Props) => {
	const dispatch = useAppDispatch()
	const { tilePlacementState } = arg

	if (!tilePlacementState) {
		throw new Error('TileArg: No tile placement state')
	}

	const onChangeRef = useRef(onChange)
	onChangeRef.current = onChange

	const handlePick = () => {
		dispatch(
			setTableState({
				pickingCellForBuyArg: {
					state: tilePlacementState,
					onPick: (x, y, location) => {
						onChangeRef.current([x, y, location])
					},
				},
			}),
		)
	}

	return (
		<ArgContainer>
			<span>{arg.descriptionPrefix}</span>

			<TileIcon content={tilePlacementState.type} />

			<Button onClick={handlePick}>Pick location</Button>

			<span>{arg.descriptionPostfix}</span>
		</ArgContainer>
	)
}
