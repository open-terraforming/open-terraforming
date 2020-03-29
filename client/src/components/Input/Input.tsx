import React, { useCallback, InputHTMLAttributes } from 'react'

type Props = {
	value: string
	onChange: (v: string) => void
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>

export const Input = ({
	value,
	type = 'text',
	onChange,
	...htmlProps
}: Props) => {
	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			onChange(e.target.value)
		},
		[onChange]
	)

	return (
		<input type={type} value={value} onChange={handleChange} {...htmlProps} />
	)
}
