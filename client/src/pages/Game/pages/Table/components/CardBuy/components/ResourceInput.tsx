import React, { useState, useEffect, useMemo } from 'react'
import { Input } from '@/components/Input/Input'
import { Resource } from '@shared/cards'
import styled from 'styled-components'

type Props = {
	res: Resource
	max: number
	initialValue?: number
	onChange: (v: number) => void
}

export const ResourceInput = ({
	onChange,
	res,
	max,
	initialValue = 0
}: Props) => {
	const [value, setValue] = useState(initialValue.toString() || '')

	const parsedValue = useMemo(() => parseInt(value, 10), [value])

	const isError = useMemo(
		() => Number.isNaN(parsedValue) || parsedValue < 0 || parsedValue > max,
		[parsedValue]
	)

	useEffect(() => {
		onChange(
			!Number.isNaN(parsedValue) ? Math.max(0, Math.min(max, parsedValue)) : 0
		)
	}, [parsedValue])

	return (
		<E>
			<Input
				min={0}
				max={max}
				type="number"
				value={value}
				error={isError}
				onChange={v => setValue(v)}
			/>
			<span>{res}</span>
		</E>
	)
}

const E = styled.div`
	display: inline-flex;
	align-items: center;
	margin-right: 0.5rem;
`
