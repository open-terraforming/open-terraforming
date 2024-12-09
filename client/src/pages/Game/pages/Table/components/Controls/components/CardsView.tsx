import { setTableState } from '@/store/modules/table'
import { useAppDispatch, useAppStore, usePlayerState } from '@/utils/hooks'
import { CardsLookupApi } from '@shared/cards'
import { UsedCardState } from '@shared/index'
import { rgba } from 'polished'
import { useEffect, useRef, useState } from 'react'
import styled, { css, useTheme } from 'styled-components'
import { CardView } from '../../CardView/CardView'

type Props = {
	open: boolean
	cards: UsedCardState[]
	play?: boolean
	openable?: boolean
	hideAdjustedPrice?: boolean
	highlightAction?: boolean
	highlightActionNoAnimation?: boolean
}

export const CardsView = ({
	open,
	cards,
	play = false,
	openable = true,
	hideAdjustedPrice,
	highlightAction,
	highlightActionNoAnimation,
}: Props) => {
	const theme = useTheme()
	const dispatch = useAppDispatch()
	const playing = useAppStore((state) => state.game.playing)
	const [mounted, setMounted] = useState(false)
	const [opening, setOpening] = useState(open)
	const closing = useRef<ReturnType<typeof setTimeout>>()
	const player = usePlayerState()

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
					width: width,
				}}
			>
				{cards.slice(0, display).map((c, i) => (
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
							transition: theme.animations.enabled
								? open
									? 'all 0.5s'
									: 'all 0.1s'
								: undefined,
							bottom: open && !opening ? 20 : -10,
							opacity: open && !opening ? 1 : 0,
						}}
						onClick={(e) => {
							e.stopPropagation()
							e.nativeEvent.stopPropagation()

							if (playing && openable) {
								dispatch(
									play
										? setTableState({
												playingCardIndex: c.index,
											})
										: setTableState({
												buyingCardIndex: c.index,
											}),
								)
							}
						}}
					>
						<Card
							card={CardsLookupApi.get(c.code)}
							state={play ? c : undefined}
							hideAdjustedPrice={hideAdjustedPrice}
							highlightAction={highlightAction}
							highlightActionNoAnimation={highlightActionNoAnimation}
							evaluateMode="playing"
							player={player}
						/>
					</CV>
				))}
			</MO>
		</E>
	)
}

const CV = styled.div<{ rotate: number }>`
	position: absolute;
	${(props) => css`
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
	background-color: ${({ theme }) => rgba(theme.colors.background, 1)};
`
