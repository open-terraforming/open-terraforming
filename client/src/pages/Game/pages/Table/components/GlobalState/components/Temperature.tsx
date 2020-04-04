import { keyMap, range } from '@/utils/collections'
import { faThermometerHalf } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ProgressMilestone } from '@shared/index'
import React, { useEffect, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { DiffAnim } from './DiffAnim'
import { MilestoneDisplay } from './MilestoneDisplay'

type Props = {
	start: number
	current: number
	target: number
	milestones: ProgressMilestone[]
}

export const Temperature = ({ start, current, target, milestones }: Props) => {
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
					{t * 2}
					{milestoneArray[t] && (
						<MilestoneDisplay side="left" milestone={milestoneArray[t]} />
					)}
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
