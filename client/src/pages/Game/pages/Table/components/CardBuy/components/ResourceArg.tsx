import React, { useState, useEffect } from 'react'
import { ArgContainer } from './ArgContainer'
import { Input } from '@/components/Input/Input'
import { CardEffectArgument } from '@shared/cards'

type Props = {
	arg: CardEffectArgument
	onChange: (v: number) => void
}

export const ResourceArg = ({ arg, onChange }: Props) => {
	const [value, setValue] = useState(0 as number)

	useEffect(() => {
		onChange(value)
	}, [])

	return (
		<ArgContainer>
			{arg.description}
			<Input
				type="number"
				value={value.toString()}
				onChange={v => {
					const p = parseInt(v, 10)

					if (p >= 0 && (arg.maxAmount === undefined || p < arg.maxAmount)) {
						setValue(p)
						onChange(p)
					}
				}}
			/>
			{arg.resource}
		</ArgContainer>
	)
}
