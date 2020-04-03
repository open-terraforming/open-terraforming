import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { range } from '@/utils/collections'
import { popOut } from '@/styles/animations'
import { DiffAnim } from './DiffAnim'

type Props = {
	start: number
	current: number
	target: number
}

export const Oxygen = ({ current, target, start }: Props) => {
	const [lastValue, setLastValue] = useState(current)
	const [diff, setDiff] = useState(0)

	useEffect(() => {
		const diff = current - lastValue

		setDiff(diff)
		setLastValue(current)

		setTimeout(() => {
			setDiff(0)
		}, 200)
	}, [current])

	return (
		<Container>
			{range(target, start - 1, -1).map(t => (
				<Step passed={current > t} active={current === t} key={t}>
					{t}
				</Step>
			))}
			<Icon>
				O<sub>2</sub>
			</Icon>
			{diff !== 0 && <DiffAnim />}
		</Container>
	)
}

const Container = styled.div`
	width: 3rem;
	border: 2px solid rgba(14, 129, 214, 0.8);
	background-color: rgba(14, 129, 214, 0.5);
	margin: 0 1rem;
	position: relative;
`

const Step = styled.div<{ passed: boolean; active: boolean }>`
	text-align: center;
	padding: 0.55rem 1rem;
	color: #fff;
	opacity: ${props => (props.active ? 1 : props.passed ? 0.8 : 0.5)};
	${props =>
		(props.passed || props.active) &&
		css`
			background: rgba(14, 129, 214, 0.8);
		`}
`

const Icon = styled.div`
	text-align: center;
	padding: 1rem;
	color: #46a3ff;
`
