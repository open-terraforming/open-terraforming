import styled from 'styled-components'
import { Checkbox } from '../Checkbox/Checkbox'
import { ReactNode } from 'react'

type Props<T> = {
	className?: string
	options: { label: string; value: T; description?: ReactNode }[]
	value: T[]
	onChange: (v: T[]) => void
}

export const MultiSelect = <T,>({
	className,
	options,
	value,
	onChange,
}: Props<T>) => {
	const handleChange = (v: T) => () => {
		if (value.includes(v)) {
			onChange(value.filter((i) => i !== v))
		} else {
			onChange([...value, v])
		}
	}

	return (
		<C className={className}>
			{options.map((o) => (
				<Option key={JSON.stringify(o.value)}>
					<Checkbox
						label={o.label}
						checked={value.includes(o.value)}
						onChange={handleChange(o.value)}
					/>
					{o.description && <Description>{o.description}</Description>}
				</Option>
			))}
		</C>
	)
}

const C = styled.div``

const Option = styled.div``

const Description = styled.div`
	margin: 0.5rem 0 1rem 0.5rem;
`
