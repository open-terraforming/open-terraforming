import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { range } from '@/utils/collections'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThermometerHalf } from '@fortawesome/free-solid-svg-icons'
import { DiffAnim } from './DiffAnim'

type Props = {
	start: number
	current: number
	target: number
}

export const Temperature = ({ start, current, target }: Props) => {
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
					{t * 2}
				</Step>
			))}
			<Icon>
				<FontAwesomeIcon icon={faThermometerHalf} size="lg" />
			</Icon>
			{diff !== 0 && <DiffAnim />}
		</Container>
	)
}

const Container = styled.div`
	width: 3rem;
	border: 2px solid rgba(14, 129, 214, 0.8);
	background-color: rgba(14, 129, 214, 0.5);
	position: relative;
`

const Step = styled.div<{ passed: boolean; active: boolean }>`
	text-align: center;
	padding: 0.3rem 1rem;
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
