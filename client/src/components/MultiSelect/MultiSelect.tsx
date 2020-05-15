import React from 'react'
import styled from 'styled-components'
import { Checkbox } from '../Checkbox/Checkbox'

type Props<T> = {
	options: { label: string; value: T }[]
	value: T[]
	onChange: (v: T[]) => void
}

export const MultiSelect = <T,>({ options, value, onChange }: Props<T>) => {
	const handleChange = (v: T) => () => {
		if (value.includes(v)) {
			onChange(value.filter(i => i !== v))
		} else {
			onChange([...value, v])
		}
	}

	return (
		<C>
			{options.map(o => (
				<Option key={JSON.stringify(o.value)}>
					<Checkbox
						label={o.label}
						checked={value.includes(o.value)}
						onChange={handleChange(o.value)}
					/>
				</Option>
			))}
		</C>
	)
}

const C = styled.div``

const Option = styled.div``
