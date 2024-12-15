import { Button } from '@/components'
import { Flex } from '@/components/Flex/Flex'
import { setGameHighlightedCells } from '@/store/modules/game'
import { setTableState } from '@/store/modules/table'
import { useAppDispatch, useGameState, usePlayerState } from '@/utils/hooks'
import { CardEffectArgument } from '@shared/cards'
import { GridCellLocation } from '@shared/gameState'
import { canPlace } from '@shared/placements'
import { allCells } from '@shared/utils'
import { useEffect, useMemo, useRef, useState } from 'react'
import { TileIcon } from '../../TileIcon/TileIcon'
import { ArgContainer } from './ArgContainer'

type TileArgValue = [x: number, y: number, location: GridCellLocation | null]

type Props = {
	arg: CardEffectArgument
	onChange: (v: TileArgValue) => void
}

export const TileArg = ({ arg, onChange }: Props) => {
	const dispatch = useAppDispatch()
	const game = useGameState()
	const player = usePlayerState()
	const { tilePlacementState } = arg
	const [location, setLocation] = useState<TileArgValue>()

	const onChangeRef = useRef(onChange)
	onChangeRef.current = onChange

	if (!tilePlacementState) {
		throw new Error('TileArg: No tile placement state')
	}

	const choices = useMemo(
		() =>
			allCells(game).filter((c) =>
				canPlace(game, player, c, tilePlacementState),
			),
		[game, player, tilePlacementState],
	)

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

	const handleMouseEnter = () => {
		if (location) {
			dispatch(
				setGameHighlightedCells([
					{
						x: location[0],
						y: location[1],
						location: location[2] ?? undefined,
					},
				]),
			)
		}
	}

	const handleMouseLeave = () => {
		dispatch(setGameHighlightedCells([]))
	}

	useEffect(() => {
		if (choices.length === 1) {
			const choice = choices[0]
			const { x, y, location } = choice

			onChangeRef.current([x, y, location ?? null])
			setLocation([x, y, location ?? null])
		}
	}, [choices])

	return (
		<ArgContainer>
			{choices.length === 0 && (
				<Flex>
					No valid locations for{' '}
					<TileIcon
						content={tilePlacementState.type}
						other={tilePlacementState.other}
						size="2.5rem"
					/>
				</Flex>
			)}
			{choices.length > 1 && (
				<Flex gap="0.5rem" justify="center">
					<span>{arg.descriptionPrefix ?? 'Place'}</span>

					<div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
						<TileIcon
							content={tilePlacementState.type}
							other={tilePlacementState.other}
							size="2.5rem"
						/>
					</div>

					{choices.length > 1 && (
						<>
							{!location && <Button onClick={handlePick}>Pick location</Button>}
							{location && (
								<Button onClick={handlePick}>Change location</Button>
							)}
						</>
					)}

					<span>{arg.descriptionPostfix}</span>
				</Flex>
			)}
		</ArgContainer>
	)
}
