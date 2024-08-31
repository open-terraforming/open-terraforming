import { Button, DialogWrapper } from '@/components'
import { Card } from '@/icons/card'
import { useAppStore, useMounted } from '@/utils/hooks'
import { CardsLookupApi } from '@shared/cards'
import {
	emptyCardState,
	isCardPlayable,
	minimalCardPrice,
} from '@shared/cards/utils'
import { range } from '@shared/utils'
import { useEffect, useMemo, useRef, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { CardView } from '../../../CardView/CardView'
import { Hand } from '../../../Hand/Hand'
import { CardsView } from '../CardsView'
import { optionalAnimation } from '@/styles/optionalAnimation'

type Props = {
	playing: boolean
}

export const HandButton = ({ playing }: Props) => {
	const player = useAppStore((state) => state.game.player)
	const game = useAppStore((state) => state.game.state)
	const count = player.cards.length

	const [toDisplay, setToDisplay] = useState([] as string[])
	const [lastCards, setLastCards] = useState(player.cards)

	const updateDiffRef = useRef<() => void | boolean>()
	const [showCards, setShowCards] = useState(false)
	const mounted = useMounted()

	updateDiffRef.current = () => {
		if (mounted.current && toDisplay.length > 0) {
			setToDisplay((d) => d.slice(1))

			return true
		}
	}

	useEffect(() => {
		const newCards = player.cards.filter((c) => !lastCards.includes(c))

		if (newCards.length > 0) {
			const updateDiff = () => {
				if (updateDiffRef.current && updateDiffRef.current()) {
					setTimeout(updateDiff, 1500)
				}
			}

			setTimeout(updateDiff, 1500)

			setLastCards(player.cards)
			setToDisplay((d) => [...d, ...newCards])
		}
	}, [count])

	const cards = useMemo(
		() =>
			player.cards
				.map((c, i) => emptyCardState(c, i))
				.filter(
					(state) =>
						player.money >=
							minimalCardPrice(CardsLookupApi.get(state.code), player) &&
						isCardPlayable(CardsLookupApi.get(state.code), {
							card: state,
							player,
							game,
						}),
				),
		[game, player],
	)

	const display = Math.min(5, Math.max(3, count))

	const startAngle = 0.7
	const angleStep = 2 * startAngle - 1

	return (
		<DialogWrapper
			dialog={(close) => <Hand playing={playing} onClose={close} />}
		>
			{(open) => (
				<CardButton
					noClip
					onClick={open}
					disabled={count === 0}
					onMouseOver={() => setShowCards(true)}
					onMouseLeave={() => setShowCards(false)}
				>
					<Cards>
						{range(0, display).map((i) => (
							<CardC
								key={i}
								style={{
									left:
										50 +
										Math.cos(
											(startAngle - (i / (display - 1)) * angleStep) * Math.PI,
										) *
											30 +
										'%',
									top:
										40 -
										Math.sin(
											(startAngle - (i / (display - 1)) * angleStep) * Math.PI,
										) *
											30 +
										'%',
									transform: `translate(-50%, -50%) rotate(${
										-(
											(startAngle - (i / (display - 1)) * angleStep) *
											Math.PI
										) +
										Math.PI / 2
									}rad)`,
								}}
							>
								<Card
									style={{
										minWidth: '3em',
										minHeight: '4.2em',
									}}
								/>
							</CardC>
						))}
					</Cards>
					<Count>{count}</Count>
					{toDisplay[0] && (
						<DiffAnim key={toDisplay[0]}>
							<CardView
								card={CardsLookupApi.get(toDisplay[0])}
								evaluate={false}
								hover={false}
							/>
						</DiffAnim>
					)}
					<CardsView cards={cards} open={showCards} />
				</CardButton>
			)}
		</DialogWrapper>
	)
}

const Cards = styled.div`
	display: flex;
	align-items: center;
	min-width: 5rem;
`

const CardC = styled.div`
	position: absolute;
	left: 0;
	top: 0;
	${optionalAnimation(css`
		transition: all 0.1s;
	`)}
`

const CardButton = styled(Button)`
	position: relative;
	min-width: 5rem;
	background-color: transparent;
	z-index: 3;
`

const Count = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 10%;
	display: flex;
	align-items: center;
	justify-content: center;
`

const popIn = keyframes`
	0% {
		opacity: 0;
		transform: translate(0, -50vh) scale(0.75);
	}
	20% {
		opacity: 1;
		transform: translate(0, -50vh) scale(0.75);
	}
	60% {
		opacity: 1;
		transform: translate(0, -50vh) scale(0.75);
	}
	90% {
		opacity: 0.6;
		transform: translate(0, -0.5rem) scale(0.3);
	}
	100% {
		opacity: 0;
		transform: translate(0, -0.5rem) scale(0.3);
	}
`

const popInWithNoAnimation = keyframes`
	0% {
		opacity: 1;
		transform: translate(0, -50vh) scale(0.75);
	}
	99% {
		opacity: 1;
		transform: translate(0, -50vh) scale(0.75);
	}
	100% {
		opacity: 0;
		transform: translate(0, -0.5rem) scale(0.3);
	}
`

const DiffAnim = styled.div`
	position: absolute;
	z-index: 3;
	left: 0;
	top: 0;

	${optionalAnimation(
		css`
			animation-name: ${popIn};
			animation-duration: 1500ms;
			animation-timing-function: ease-out;
			animation-fill-mode: forwards;
		`,
		css`
			animation-name: ${popInWithNoAnimation};
			animation-duration: 1500ms;
			animation-timing-function: ease-out;
			animation-fill-mode: forwards;
		`,
	)}

	text-transform: none;

	color: #fff;
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
`
