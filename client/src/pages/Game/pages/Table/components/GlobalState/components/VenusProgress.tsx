import { keyMap, range } from '@/utils/collections'
import { ProgressMilestoneItem } from '@shared/index'
import React, { useEffect, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { DiffAnim } from './DiffAnim'
import { MilestoneDisplay } from './MilestoneDisplay'
import { colors } from '@/styles'
import { darken } from 'polished'
import { venusIcon } from '@/icons/venus'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = {
	start: number
	current: number
	target: number
	milestones: ProgressMilestoneItem[]
}

export const VenusProgress = ({
	start,
	current,
	target,
	milestones
}: Props) => {
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
			<Icon>
				<FontAwesomeIcon icon={venusIcon} />
			</Icon>
			{range(start, target + 1).map(t => (
				<Step passed={current > t} active={current === t} key={t}>
					{t >= current ? t * 2 : '\u00A0'}
					{milestoneArray[t] && (
						<MilestoneDisplay side="bottom" milestone={milestoneArray[t]} />
					)}
				</Step>
			))}
			{diff !== 0 && <DiffAnim />}
		</Container>
	)
}

const Container = styled.div`
	height: 2rem;
	border: 2px solid ${colors.border};
	background-color: ${colors.background};
	position: relative;
	display: flex;
	justify-content: center;
	align-items: stretch;
`

const Step = styled.div<{ passed: boolean; active: boolean }>`
	text-align: center;
	width: 1.6rem;
	position: relative;
	transition: background-color 500ms, opacity 500ms, color 500ms;
	display: flex;
	justify-content: center;
	align-items: center;

	${props =>
		props.passed || props.active
			? css`
					background-color: ${colors.border};
			  `
			: css`
					color: ${darken(0.3, colors.text)};
			  `}
`

const Icon = styled.div`
	text-align: center;
	color: #46a3ff;
	width: 2rem;
	display: flex;
	justify-content: center;
	align-items: center;
`
