import React, { useCallback, InputHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

type Props = {
	value: string
	error?: boolean
	onChange: (v: string) => void
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>

export const Input = ({
	value,
	type = 'text',
	onChange,
	error = false,
	...htmlProps
}: Props) => {
	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			onChange(e.target.value)
		},
		[onChange]
	)

	return (
		<StyledInput
			error={error}
			type={type}
			value={value}
			onChange={handleChange}
			{...htmlProps}
		/>
	)
}

const StyledInput = styled.input<{ error: boolean }>`
	&& {
		${props =>
			props.error &&
			css`
				border: 1px solid #ff9999;
				background-color: rgba(255, 153, 153, 0.2);
			`}
	}
`
