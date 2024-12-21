import { Button } from '@/components'
import { Flex } from '@/components/Flex/Flex'
import { setGameHighlightedCells } from '@/store/modules/game'
import {
	pushSelectedTile,
	removeSelectedTile,
	setTableState,
} from '@/store/modules/table'
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
	const [selectedLocation, setSelectedLocation] = useState<TileArgValue>()

	const onChangeRef = useRef(onChange)
	onChangeRef.current = onChange

	const handlePickResult = (
		x: number,
		y: number,
		location: GridCellLocation | null,
	) => {
		if (selectedLocation) {
			dispatch(
				removeSelectedTile(
					selectedLocation[0],
					selectedLocation[1],
					selectedLocation[2] ?? undefined,
				),
			)
		}

		onChangeRef.current([x, y, location])
		setSelectedLocation([x, y, location])
		dispatch(pushSelectedTile(x, y, location ?? undefined))
	}

	const handlePickResultRef = useRef(handlePickResult)
	handlePickResultRef.current = handlePickResult

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
						handlePickResultRef.current(x, y, location)
					},
				},
			}),
		)
	}

	const handleMouseEnter = () => {
		if (selectedLocation) {
			dispatch(
				setGameHighlightedCells([
					{
						x: selectedLocation[0],
						y: selectedLocation[1],
						location: selectedLocation[2] ?? undefined,
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
			setSelectedLocation([x, y, location ?? null])
		}
	}, [choices])

	useEffect(() => {
		return () => {
			if (selectedLocation) {
				dispatch(
					removeSelectedTile(
						selectedLocation[0],
						selectedLocation[1],
						selectedLocation[2] ?? undefined,
					),
				)
			}
		}
	}, [])

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
							{!selectedLocation && (
								<Button onClick={handlePick}>Pick location</Button>
							)}
							{selectedLocation && (
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
