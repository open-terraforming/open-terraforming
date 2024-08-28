import { useChange } from '@/utils/hooks'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import styled from 'styled-components'

type Props = {
	label?: string
	onChange?: (v: boolean) => void
	checked?: boolean
}

export const Checkbox = ({ label, checked, onChange }: Props) => {
	const [value, setValue] = useState(checked ?? false)

	useChange(() => {
		onChange?.(value)
	}, [value])

	return (
		<E>
			<input
				type="checkbox"
				checked={value}
				onChange={(e) => setValue(e.target.checked)}
			/>
			<Custom>
				{value && <FontAwesomeIcon icon={faCheck} fixedWidth size="xs" />}
			</Custom>
			{label}
		</E>
	)
}

const Custom = styled.span`
	border: 0.1rem solid ${({ theme }) => theme.colors.border};
	background-color: ${({ theme }) => theme.colors.background};
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
