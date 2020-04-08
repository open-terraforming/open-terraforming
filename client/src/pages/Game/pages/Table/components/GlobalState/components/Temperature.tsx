import { keyMap, range } from '@/utils/collections'
import { faThermometerHalf } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ProgressMilestoneItem } from '@shared/index'
import React, { useEffect, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { DiffAnim } from './DiffAnim'
import { MilestoneDisplay } from './MilestoneDisplay'
import { colors, mainColors } from '@/styles'
import { darken } from 'polished'

type Props = {
	start: number
	current: number
	target: number
	milestones: ProgressMilestoneItem[]
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
					{t >= current ? t * 2 : '\u00A0'}
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
	border: 2px solid ${colors.border};
	background-color: ${colors.background};
	position: relative;
`

const Step = styled.div<{ passed: boolean; active: boolean }>`
	text-align: center;
	padding: 0.3rem 1rem;
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
