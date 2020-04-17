import { Button, DialogWrapper } from '@/components'
import { Card } from '@/icons/card'
import { useAppStore } from '@/utils/hooks'
import { faAngleUp } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Hand } from '../../../Hand/Hand'

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

	return (
		<DialogWrapper dialog={close => <Hand playing={playing} onClose={close} />}>
			{open => (
				<CardButton icon={faAngleUp} onClick={open} disabled={count === 0}>
					{count} cards in hand
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

const CardButton = styled(Button)`
	position: relative;
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
