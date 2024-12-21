import { setGameHighlightedCells } from '@/store/modules/game'
import { useAppDispatch } from '@/utils/hooks'
import { TilePlaced } from '@shared/index'
import { useEffect } from 'react'
import styled from 'styled-components'
import { Symbols } from '../../CardView/components/Symbols'
import { PlayerDidHeader } from './PlayerDidHeader'

type Props = {
	event: TilePlaced
}

export const TilePlacedEvent = ({ event }: Props) => {
	const dispatch = useAppDispatch()

	const handleMouseOver = () => {
		dispatch(setGameHighlightedCells([event.cell]))
	}

	const handleMouseLeave = () => {
		dispatch(setGameHighlightedCells([]))
	}

	useEffect(() => {
		dispatch(setGameHighlightedCells([]))
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
