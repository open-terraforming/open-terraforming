import React, { useState, useEffect, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { range, keyMap } from '@/utils/collections'
import { DiffAnim } from './DiffAnim'
import { ProgressMilestoneItem } from '@shared/index'
import { MilestoneDisplay } from './MilestoneDisplay'

type Props = {
	start: number
	current: number
	target: number
	milestones: ProgressMilestoneItem[]
}

export const Oxygen = ({ current, target, start, milestones }: Props) => {
	const [lastValue, setLastValue] = useState(current)
	const [diff, setDiff] = useState(0)

	const milestoneArray = useMemo(() => keyMap(milestones, 'value'), [
		milestones
	])

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
					{milestoneArray[t] && (
						<MilestoneDisplay side="right" milestone={milestoneArray[t]} />
					)}
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
	margin-right: 2rem;
`

const Step = styled.div<{ passed: boolean; active: boolean }>`
	text-align: center;
	padding: 0.55rem 1rem;
	color: #fff;
	opacity: ${props => (props.active ? 1 : props.passed ? 0.8 : 0.5)};
	position: relative;
	transition: background 500ms, opacity 500ms;

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
