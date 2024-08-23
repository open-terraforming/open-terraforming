import { faTint, faThermometerHalf } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ProgressMilestoneType, ProgressMilestoneItem } from '@shared/index'
import { useMemo } from 'react'
import styled, { css } from 'styled-components'
import { ResourceIcon } from '../../ResourceIcon/ResourceIcon'
import { Card } from '@/icons/card'

type Side = 'left' | 'right' | 'bottom'

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
			case ProgressMilestoneType.Card:
				return (
					<div title="Draw a card">
						<Card />
					</div>
				)
			case ProgressMilestoneType.TerraformingRating:
				return <div title="Increase your rating">TR</div>
			default:
				return <>{ProgressMilestoneType[milestone.type]}</>
		}
	}, [milestone.type])

	return milestone.used ? <></> : <E side={side}>{icon}</E>
}

const E = styled.div<{ side: Side }>`
	position: absolute;

	top: 0;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	z-index: 1;
	margin-left: -2px;

	> * {
		padding: 0.5rem;
		border: 2px solid ${({ theme }) => theme.colors.background};
		background: ${({ theme }) => theme.colors.background};
	}

	${(props) =>
		props.side === 'left' &&
		css`
			left: -100%;
			justify-content: flex-end;

			> * {
				border-top-left-radius: 0.5rem;
				border-bottom-left-radius: 0.5rem;
				border-right: 0;
			}
		`}
	${(props) =>
		props.side === 'right' &&
		css`
			left: 100%;
			justify-content: flex-start;
			margin-left: 2px;

			> * {
				border-top-right-radius: 0.5rem;
				border-bottom-right-radius: 0.5rem;
				border-left: 0;
			}
		`}
		${(props) =>
		props.side === 'bottom' &&
		css`
			top: 100%;
			justify-content: flex-start;
			margin-top: 3px;
			margin-left: -12px;

			> * {
				border-bottom-left-radius: 0.5rem;
				border-bottom-right-radius: 0.5rem;
				border-top: 0;
			}
		`}
`
