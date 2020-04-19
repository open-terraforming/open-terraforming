import React, { useState, useEffect, useRef } from 'react'
import { PlayerState } from '@shared/index'
import { Resource } from '@shared/cards'
import { voidReduce } from '@/utils/collections'
import styled, { keyframes } from 'styled-components'
import { ResourceIcon } from '../../../ResourceIcon/ResourceIcon'
import { Portal } from '@/components'
import { colors } from '@/styles'
import { rgba } from 'polished'
import { nextFrame } from '@/utils/async'

type Props = {
	player: PlayerState
	x: number
	y: number
}

const resources: Resource[] = [
	'money',
	'ore',
	'titan',
	'plants',
	'energy',
	'heat'
]

export const ResourcesDiff = ({ player, x, y }: Props) => {
	const [diff, setDiff] = useState(
		undefined as Record<Resource, number> | undefined
	)

	const [render, setRender] = useState(0)
	const [prev, setPrev] = useState({} as Record<Resource, number>)
	const [mounted, setMounted] = useState(false)
	const disappear = useRef<number>()

	useEffect(() => {
		nextFrame().then(() => {
			setMounted(!!diff)
		})
	}, [diff])

	useEffect(() => {
		const newDiff = voidReduce(
			resources,
			{} as Record<Resource, number>,
			(acc, r) => {
				acc[r] = player[r] - (prev[r] ?? 0)
			}
		)

		if (Object.values(newDiff).find(c => c !== 0)) {
			if (diff) {
				resources.forEach(r => {
					newDiff[r] += diff[r] ?? 0
				})
			}

			if (!Object.values(newDiff).find(c => c !== 0)) {
				setDiff(undefined)
			} else {
				setDiff(newDiff)
				setRender(r => r + 1)

				if (disappear.current) {
					clearTimeout(disappear.current)
				}

				disappear.current = setTimeout(() => {
					setDiff(undefined)

					clearTimeout(disappear.current)
				}, 2500)
			}
		}

		setPrev(
			voidReduce(resources, {} as Record<Resource, number>, (acc, r) => {
				acc[r] = player[r]
			})
		)
	}, [player])

	return diff && !isNaN(x) && !isNaN(y) ? (
		<Portal>
			<E key={render} style={{ left: x, top: y, opacity: mounted ? 1 : 0 }}>
				{resources
					.filter(r => diff[r] !== 0)
					.map(r => (
						<R key={r}>
							<span>{diff[r] > 0 ? `+${diff[r]}` : diff[r]}</span>
							<ResourceIcon res={r} />
						</R>
					))}
			</E>
		</Portal>
	) : null
}

const PopOut = keyframes`
	0% { opacity: 1; transform: translate(0, 0); }
	100% { opacity: 0; transform: translate(-200px, 0); }
`

const E = styled.div`
	position: absolute;
	display: flex;
	background-color: ${colors.background};

	background: linear-gradient(
		to right,
		${rgba(colors.background, 0)} 0%,
		${colors.background} 18%,
		${colors.background} 100%
	);

	padding: 0.8rem;
	transition: opacity 0.2s;

	animation-name: ${PopOut};
	animation-duration: 500ms;
	animation-delay: 2000ms;
	animation-fill-mode: forwards;
`

const R = styled.div`
	margin: 0 0.5rem;

	> span {
		margin-right: 0.2rem;
	}
`
