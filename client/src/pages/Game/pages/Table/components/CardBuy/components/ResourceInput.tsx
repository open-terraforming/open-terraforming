import { NumberInput } from '@/components/NumberInput/NumberInput'
import { Resource } from '@shared/cards'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ResourceIcon } from '../../ResourceIcon/ResourceIcon'

type Props = {
	res: Resource
	min?: number
	max: number
	production?: boolean
	initialValue?: number
	onChange: (v: number) => void
}

export const ResourceInput = ({
	onChange,
	res,
	min = 0,
	max,
	production,
	initialValue = 0,
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
				onChange={(v) => setValue(v)}
				value={value}
				iconComponent={<ResourceIcon res={res} production={production} />}
			/>
		</E>
	)
}

const E = styled.div`
	display: inline-flex;
	align-items: center;
	margin-right: 0.5rem;
`
