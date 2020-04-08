import React, { useState, useEffect, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { range, keyMap } from '@/utils/collections'
import { DiffAnim } from './DiffAnim'
import { ProgressMilestoneItem } from '@shared/index'
import { MilestoneDisplay } from './MilestoneDisplay'
import { colors, mainColors } from '@/styles'
import { darken } from 'polished'

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
					{t >= current ? t : '\u00A0'}
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
	border: 2px solid ${colors.border};
	background-color: ${colors.background};
	margin: 0 1rem;
	position: relative;
	margin-right: 2rem;
`

const Step = styled.div<{ passed: boolean; active: boolean }>`
	text-align: center;
	padding: 0.55rem 1rem;
	position: relative;
	transition: background-color 500ms, opacity 500ms, color 500ms;

	${props =>
		props.passed || props.active
			? css`
					background-color: ${colors.border};
			  `
			: css`
					color: ${darken(0.3, mainColors.text)};
			  `}
`

const Icon = styled.div`
	text-align: center;
	padding: 1rem;
	color: #46a3ff;
`
