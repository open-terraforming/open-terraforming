import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { colors } from '@/styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

type Props = {
	label?: string
	onChange?: (v: boolean) => void
	checked?: boolean
}

export const Checkbox = ({ label, checked, onChange }: Props) => {
	const [value, setValue] = useState(checked ?? false)

	useEffect(() => {
		onChange && onChange(value)
	}, [value, onChange])

	return (
		<E>
			<input
				type="checkbox"
				checked={value}
				onChange={e => setValue(e.target.checked)}
			/>
			<Custom>
				{value && <FontAwesomeIcon icon={faCheck} fixedWidth size="xs" />}
			</Custom>
			{label}
		</E>
	)
}

const Custom = styled.span`
	border: 0.1rem solid ${colors.border};
	background-color: ${colors.background};
	margin-right: 0.3rem;
	width: 1.2rem;
	height: 1.2rem;
	display: flex;
	justify-content: center;
	align-items: center;
	box-sizing: border-box;
`

const E = styled.label`
	display: flex;
	align-items: center;

	> input[type='checkbox'] {
		display: none;
	}
`
