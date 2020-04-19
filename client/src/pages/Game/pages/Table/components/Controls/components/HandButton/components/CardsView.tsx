import React, { useMemo, useEffect, useState, useRef } from 'react'
import { useAppStore, useAppDispatch } from '@/utils/hooks'
import styled, { css } from 'styled-components'
import { CardView } from '../../../../CardView/CardView'
import { CardsLookupApi } from '@shared/cards'
import { colors } from '@/styles'
import { rgba } from 'polished'
import {
	isCardPlayable,
	emptyCardState,
	minimalCardPrice
} from '@shared/cards/utils'
import { setTableState } from '@/store/modules/table'

type Props = {
	open: boolean
}

export const CardsView = ({ open }: Props) => {
	const dispatch = useAppDispatch()
	const player = useAppStore(state => state.game.player)
	const game = useAppStore(state => state.game.state)
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
			}, 500)
		} else {
			setMounted(true)
			setOpening(true)

			setTimeout(() => {
				setOpening(false)
			})
		}
	}, [open])

	const cards = useMemo(
		() =>
			player.cards
				.map((c, i) => [c, i] as const)
				.filter(
					([c]) =>
						player.money >= minimalCardPrice(CardsLookupApi.get(c), player) &&
						isCardPlayable(CardsLookupApi.get(c), {
							card: emptyCardState(c),
							cardIndex: -1,
							player,
							game,
							playerId: player.id
						})
				),
		[game, player]
	)

	const cardWidth = 100
	const display = cards.length // Math.min(cards.length, 10)
	const width = display * cardWidth * 1.3 + 60

	return !mounted ? null : (
		<E>
			<MO
				style={{
					left: -width / 2,
					width: width
				}}
			>
				{cards.slice(0, display).map(([c, cardIndex], i) => (
					<CV
						key={c}
						rotate={
							open && !opening ? (display - i - 1 - (display - 1) / 2) * 8 : 0
						}
						style={{
							left:
								open && !opening
									? width / 2 +
									  (display - i - 1 - (display - 1) / 2) * cardWidth
									: width / 2,
							transition: 'all 0.5s',
							bottom: open && !opening ? -70 : -80,
							opacity: open && !opening ? 1 : 0
						}}
						onClick={e => {
							e.stopPropagation()
							e.nativeEvent.stopPropagation()

							dispatch(
								setTableState({
									buyingCardIndex: cardIndex
								})
							)
						}}
					>
						<Card card={CardsLookupApi.get(c)} />
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

		&:hover {
			transform: translate(-50%, 0) rotate(${props.rotate * 0.5}deg) scale(1);
			z-index: 1;
		}
	`}
`

const MO = styled.div`
	position: absolute;
	top: -330px;
	height: 240px;
`

const E = styled.div`
	position: absolute;
	left: 50%;
`

const Card = styled(CardView)`
	background-color: ${rgba(colors.background, 1)};
`
