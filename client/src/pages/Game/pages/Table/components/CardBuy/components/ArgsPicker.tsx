import React, { useState } from 'react'
import { CardEffectArgumentType, CardEffect } from '@shared/cards'
import { UsedCardState } from '@shared/index'
import { Arg } from './Arg'

type Props = {
	effect: CardEffect
	cardState?: UsedCardState
	onChange: (args: CardEffectArgumentType[]) => void
}

export const ArgsPicker = ({ effect, cardState, onChange }: Props) => {
	const [values, setValues] = useState([] as CardEffectArgumentType[])

	return (
		<div>
			{effect.args.map((a, i) => (
				<Arg
					key={i}
					arg={a}
					card={cardState}
					onChange={v => {
						const updated = [...values]
						updated[i] = v
						setValues(updated)
						onChange(updated)
					}}
				/>
			))}
		</div>
	)
}
