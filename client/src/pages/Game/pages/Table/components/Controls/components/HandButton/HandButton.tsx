import { Button, DialogWrapper } from '@/components'
import { Card } from '@/icons/card'
import { useAppStore } from '@/utils/hooks'
import React, { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Hand } from '../../../Hand/Hand'
import { range } from '@shared/utils'

type Props = {
	playing: boolean
}

export const HandButton = ({ playing }: Props) => {
	const count = useAppStore(state => state.game.player?.cards.length) || 0

	const [lastCount, setLastCount] = useState(count)
	const [diff, setDiff] = useState(0)
	const updateDiffRef = useRef<() => void>()

	updateDiffRef.current = () => {
		if (diff > 0) {
			setDiff(diff - 1)

			return true
		}
	}

	useEffect(() => {
		const diff = count - lastCount

		if (diff > 0) {
			const updateDiff = () => {
				if (updateDiffRef.current && updateDiffRef.current()) {
					setTimeout(updateDiff, 1000)
				}
			}

			setTimeout(updateDiff, 1000)
		}

		setLastCount(count)
		setDiff(diff)
	}, [count])

	const display = Math.min(5, Math.max(3, count))

	const startAngle = 0.7
	const angleStep = 2 * startAngle - 1

	return (
		<DialogWrapper dialog={close => <Hand playing={playing} onClose={close} />}>
			{open => (
				<CardButton onClick={open} disabled={count === 0}>
					<Cards>
						{range(0, display).map(i => (
							<CardC
								key={i}
								style={{
									left:
										50 +
										Math.cos(
											(startAngle - (i / (display - 1)) * angleStep) * Math.PI
										) *
											30 +
										'%',
									top:
										40 -
										Math.sin(
											(startAngle - (i / (display - 1)) * angleStep) * Math.PI
										) *
											30 +
										'%',
									transform: `translate(-50%, -50%) rotate(${-(
										(startAngle - (i / (display - 1)) * angleStep) *
										Math.PI
									) +
										Math.PI / 2}rad)`
								}}
							>
								<Card
									style={{
										minWidth: '3em',
										minHeight: '4.2em'
									}}
								/>
							</CardC>
						))}
					</Cards>
					<Count>{count}</Count>
					{diff > 0 && (
						<DiffAnim key={diff}>
							<Card />
						</DiffAnim>
					)}
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
	transition: all 0.1s;
	left: 0;
	top: 0;
`

const CardButton = styled(Button)`
	position: relative;
	min-width: 5rem;
	background-color: transparent;
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
		transform: translate(0, -10rem);
	}
	50% {
		opacity: 1;
		transform: translate(0, -10rem);
	}
	90% {
		opacity: 0.6;
		transform: translate(0, -0.5rem);
	}
	100% {
		opacity: 0;
		transform: translate(0, -0.5rem);
	}
`

const DiffAnim = styled.div`
	position: absolute;
	z-index: 3;
	left: 0;
	top: 0;
	animation-name: ${popIn};
	animation-duration: 1000ms;
	animation-timing-function: ease-out;
	color: #fff;
	text-align: center;
	font-size: 200%;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
`
