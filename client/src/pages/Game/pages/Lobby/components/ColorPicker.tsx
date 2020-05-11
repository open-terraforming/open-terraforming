import React from 'react'
import { PlayerColors } from '@shared/player-colors'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faChevronLeft,
	faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import { colors } from '@/styles'

type Props = {
	colors: number[]
	value: number
	onChange: (index: number) => void
	readOnly?: boolean
}

export const ColorPicker = ({ value, onChange, colors, readOnly }: Props) => {
	const color = value >= 0 ? PlayerColors[value] : '#000'

	const handlePrev = () => {
		if (value === -1) {
			onChange(colors.length > 0 ? colors[colors.length - 1] : -1)
		} else {
			const index = colors.indexOf(value)

			if (index <= -1) {
				onChange(-1)
			} else {
				onChange(colors[index - 1])
			}
		}
	}

	const handleNext = () => {
		if (value === -1) {
			onChange(colors.length > 0 ? colors[0] : -1)
		} else {
			const index = colors.indexOf(value)

			if (index === -1 || index >= colors.length) {
				onChange(-1)
			} else {
				onChange(colors[index + 1])
			}
		}
	}

	return (
		<E>
			{!readOnly && (
				<Change onClick={handlePrev}>
					<FontAwesomeIcon icon={faChevronLeft} />
				</Change>
			)}
			<Value style={{ backgroundColor: color }}>
				{value === -1 ? '?' : ''}
			</Value>
			{!readOnly && (
				<Change onClick={handleNext}>
					<FontAwesomeIcon icon={faChevronRight} />
				</Change>
			)}
		</E>
	)
}

const E = styled.div`
	display: flex;
	align-items: center;
	margin-right: 0.5rem;
`

const Value = styled.div`
	width: 1rem;
	height: 1rem;
	color: #fff;
	text-align: center;
`

const Change = styled.button`
	padding: 0.5rem 0.2rem;
	cursor: pointer;
	color: ${colors.text};
`
