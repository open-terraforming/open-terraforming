import { setTableState } from '@/store/modules/table'
import { colors } from '@/styles'
import { useAppDispatch, useAppStore } from '@/utils/hooks'
import { CardsLookupApi } from '@shared/cards'
import { UsedCardState } from '@shared/index'
import { rgba } from 'polished'
import React, { useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { CardView } from '../../CardView/CardView'

type Props = {
	open: boolean
	cards: { state: UsedCardState; cardIndex: number }[]
	play?: boolean
	openable?: boolean
}

export const CardsView = ({
	open,
	cards,
	play = false,
	openable = true
}: Props) => {
	const dispatch = useAppDispatch()
	const playing = useAppStore(state => state.game.playing)
	const [mounted, setMounted] = useState(false)
	const [opening, setOpening] = useState(open)
	const closing = useRef<number>()

	useEffect(() => {
		if (closing.current !== undefined) {
			clearTimeout(closing.current)
			closing.current = undefined
		}

		if (!open) {
			closing.current = setTimeout(() => {
				setMounted(false)
			}, 100)
		} else {
			setMounted(true)
			setOpening(true)

			setTimeout(() => {
				setOpening(false)
			})
		}
	}, [open])

	const cardWidth = 100
	const display = cards.length // Math.min(cards.length, 10)
	const width = display * cardWidth * 1.3 + 90

	return !mounted ? null : (
		<E>
			<MO
				style={{
					left: -width / 2,
					width: width
				}}
			>
				{cards.slice(0, display).map(({ state: c, cardIndex }, i) => (
					<CV
						key={c.code}
						rotate={
							open && !opening ? (display - i - 1 - (display - 1) / 2) * 8 : 0
						}
						style={{
							left:
								open && !opening
									? width / 2 +
									  (display - i - 1 - (display - 1) / 2) * cardWidth
									: width / 2,
							transition: open ? 'all 0.5s' : 'all 0.1s',
							bottom: open && !opening ? 20 : -10,
							opacity: open && !opening ? 1 : 0
						}}
						onClick={e => {
							e.stopPropagation()
							e.nativeEvent.stopPropagation()

							if (playing && openable) {
								dispatch(
									play
										? setTableState({
												playingCardIndex: cardIndex
										  })
										: setTableState({
												buyingCardIndex: cardIndex
										  })
								)
							}
						}}
					>
						<Card
							card={CardsLookupApi.get(c.code)}
							state={play ? c : undefined}
							cardIndex={play ? cardIndex : undefined}
							fade={false}
						/>
					</CV>
				))}
			</MO>
		</E>
	)
}

const CV = styled.div<{ rotate: number }>`
	position: absolute;
	${props => css`
		transform: translate(-50%, 0) rotate(${props.rotate}deg) scale(0.75);
		transform-origin: bottom center;

		&:hover {
			transform: translate(-50%, 0) rotate(${props.rotate * 0.5}deg) scale(1);
			z-index: 1;
		}
	`}
`

const MO = styled.div`
	position: absolute;
	top: -250px;
	height: 240px;
`

const E = styled.div`
	position: absolute;
	left: 50%;
	top: 0;
	text-transform: none;
`

const Card = styled(CardView)`
	background-color: ${rgba(colors.background, 1)};
`
