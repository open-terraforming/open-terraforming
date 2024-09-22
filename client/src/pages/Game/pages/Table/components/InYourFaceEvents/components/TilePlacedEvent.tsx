import { setGameHighlightedCell } from '@/store/modules/game'
import { useAppDispatch } from '@/utils/hooks'
import { TilePlaced } from '@shared/index'
import { useEffect } from 'react'
import styled from 'styled-components'
import { Symbols } from '../../CardView/components/Symbols'
import { PlayerDidHeader } from './PlayerDidHeader'

type Props = {
	event: TilePlaced
	onOpacityChange: (opacity: number) => void
}

export const TilePlacedEvent = ({ event, onOpacityChange }: Props) => {
	const dispatch = useAppDispatch()

	const handleMouseOver = () => {
		onOpacityChange(0.1)
		dispatch(setGameHighlightedCell(event.cell))
	}

	const handleMouseLeave = () => {
		onOpacityChange(1)
		dispatch(setGameHighlightedCell(undefined))
	}

	useEffect(() => {
		onOpacityChange(1)
		dispatch(setGameHighlightedCell(undefined))
	}, [])

	return (
		<>
			<PlayerDidHeader playerId={event.playerId} thing=" placed tile" />

			<BigSymbols onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
				<Symbols symbols={[{ tile: event.tile, tileOther: event.other }]} />
			</BigSymbols>

			<Note>Hover over title to see its location</Note>
		</>
	)
}

const BigSymbols = styled.div`
	font-size: 200%;
`

const Note = styled.div`
	font-size: 80%;
	opacity: 0.8;
	margin: 0.5rem 0;
`
