import { colors, mainColors } from '@/styles'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import {
	faChevronLeft,
	faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { darken, rgba } from 'polished'
import React from 'react'
import styled, { css } from 'styled-components'

type Props = {
	className?: string
	value: number
	min?: number
	max?: number
	onChange: (v: number) => void
	icon?: IconProp
	iconComponent?: React.ReactChild
}

export const NumberInput = ({
	className,
	value,
	onChange,
	min,
	max,
	icon,
	iconComponent
}: Props) => {
	const handleChange = (v: number) => {
		if (min !== undefined) {
			v = Math.max(min, v)
		}

		if (max !== undefined) {
			v = Math.min(max, v)
		}

		if (v !== value) {
			onChange(v)
		}
	}

	return (
		<E className={className}>
			<ChangeButton
				disabled={min !== undefined && value <= min}
				onClick={() => {
					handleChange(value - 1)
				}}
			>
				<FontAwesomeIcon icon={faChevronLeft} />
			</ChangeButton>
			<Value hasIcon={!!(icon || iconComponent)}>
				{value}

				{icon && (
					<Icon>
						<FontAwesomeIcon icon={icon} />
					</Icon>
				)}

				{iconComponent && <Icon>{iconComponent}</Icon>}
			</Value>
			<ChangeButton
				disabled={max !== undefined && value >= max}
				onClick={() => {
					handleChange(value + 1)
				}}
			>
				<FontAwesomeIcon icon={faChevronRight} />
			</ChangeButton>
		</E>
	)
}

const E = styled.div`
	display: inline-flex;
`

const Icon = styled.div`
	margin: 0 0.3rem;
`

const Value = styled.div<{ hasIcon: boolean }>`
	padding: 0.3rem;
	background-color: ${rgba(darken(0.2, mainColors.application), 0.5)};
	display: flex;
	align-items: center;
	justify-content: center;
	min-width: ${props => (props.hasIcon ? '3rem' : '2rem')};
`

const ChangeButton = styled.button<{ disabled: boolean }>`
	padding: 0.3rem;
	display: flex;
	align-items: center;
	background-color: ${colors.border};
	color: ${mainColors.text};

	&& {
		margin-left: 0;
		margin-right: 0;
	}

	${props =>
		props.disabled
			? css`
					color: ${darken(0.2, mainColors.text)};
					background-color: ${darken(0.1, colors.border)};
			  `
			: css`
					cursor: pointer;
			  `}
`
