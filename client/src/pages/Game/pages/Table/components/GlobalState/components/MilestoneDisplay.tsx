import { colors } from '@/styles'
import { faTint, faThermometerHalf } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ProgressMilestoneType, ProgressMilestoneItem } from '@shared/index'
import React, { useMemo } from 'react'
import styled, { css } from 'styled-components'
import { ResourceIcon } from '../../ResourceIcon/ResourceIcon'

type Side = 'left' | 'right'

type Props = {
	milestone: ProgressMilestoneItem
	side: Side
}

export const MilestoneDisplay = ({ milestone, side }: Props) => {
	const icon = useMemo(() => {
		switch (milestone.type) {
			case ProgressMilestoneType.Ocean:
				return <FontAwesomeIcon icon={faTint} title={'Build an Ocean'} />
			case ProgressMilestoneType.Heat:
				return (
					<div title={'Increase your heat production'}>
						<ResourceIcon res="heat" />
					</div>
				)
			case ProgressMilestoneType.Temperature:
				return (
					<FontAwesomeIcon
						icon={faThermometerHalf}
						title="Increase temperature"
					/>
				)
			default:
				return <>{ProgressMilestoneType[milestone.type]}</>
		}
	}, [milestone.type])

	return <E side={side}>{icon}</E>
}

const E = styled.div<{ side: Side }>`
	position: absolute;

	top: 0;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;

	> * {
		padding: 0.5rem;
		border: 2px solid ${colors.background};
		background: ${colors.background};
	}

	${props =>
		props.side === 'left'
			? css`
					left: -100%;
					justify-content: flex-end;

					* {
						border-top-left-radius: 0.5rem;
						border-bottom-left-radius: 0.5rem;
						border-right: 0;
					}
			  `
			: css`
					left: 100%;
					justify-content: flex-start;

					* {
						border-top-right-radius: 0.5rem;
						border-bottom-right-radius: 0.5rem;
						border-left: 0;
					}
			  `}
`
