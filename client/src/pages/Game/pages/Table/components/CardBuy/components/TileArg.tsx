import { Button } from '@/components'
import { setTableState } from '@/store/modules/table'
import { useAppDispatch } from '@/utils/hooks'
import { CardEffectArgument } from '@shared/cards'
import { GridCellLocation } from '@shared/gameState'
import { useRef, useState } from 'react'
import { TileIcon } from '../../TileIcon/TileIcon'
import { ArgContainer } from './ArgContainer'
import { Flex } from '@/components/Flex/Flex'

type TileArgValue = [x: number, y: number, location: GridCellLocation | null]

type Props = {
	arg: CardEffectArgument
	onChange: (v: TileArgValue) => void
}

export const TileArg = ({ arg, onChange }: Props) => {
	const dispatch = useAppDispatch()
	const { tilePlacementState } = arg
	const [location, setLocation] = useState<TileArgValue>()

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
						setLocation([x, y, location])
					},
				},
			}),
		)
	}

	return (
		<ArgContainer>
			<Flex gap="0.5rem">
				<span>{arg.descriptionPrefix ?? 'Place'}</span>

				<TileIcon content={tilePlacementState.type} />

				{!location && <Button onClick={handlePick}>Pick location</Button>}

				{location && (
					<>
						<div>
							at {location[0]},{location[1]}
						</div>
						<Button onClick={handlePick}>Change</Button>
					</>
				)}

				<span>{arg.descriptionPostfix}</span>
			</Flex>
		</ArgContainer>
	)
}
