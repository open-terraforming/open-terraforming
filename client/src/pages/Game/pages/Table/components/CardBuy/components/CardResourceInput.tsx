import { NumberInput } from '@/components/NumberInput/NumberInput'
import { CardResource } from '@shared/cards'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { CardResourceIcon } from '../../CardResourceIcon/CardResourceIcon'

type Props = {
	res: CardResource
	min?: number
	max: number
	initialValue?: number
	onChange: (v: number) => void
}

export const CardResourceInput = ({
	onChange,
	res,
	min = 0,
	max,
	initialValue = 0
}: Props) => {
	const [value, setValue] = useState(initialValue)

	useEffect(() => {
		onChange(value)
	}, [value])

	return (
		<E>
			<NumberInput
				min={min}
				max={max}
				onChange={v => setValue(v)}
				value={value}
				iconComponent={<CardResourceIcon res={res} />}
			/>
		</E>
	)
}

const E = styled.div`
	display: inline-flex;
	align-items: center;
	margin-right: 0.5rem;
`
