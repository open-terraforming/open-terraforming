import React, { useState, useEffect } from 'react'
import { CardEffectArgumentType, CardEffect } from '@shared/cards'
import { UsedCardState } from '@shared/index'
import { Arg } from './Arg'

type Props = {
	effect: CardEffect
	card: string
	cardIndex?: number
	cardState?: UsedCardState
	onChange: (args: CardEffectArgumentType[]) => void
}

export const ArgsPicker = ({
	effect,
	card,
	cardState,
	cardIndex,
	onChange
}: Props) => {
	const [values, setValues] = useState([] as CardEffectArgumentType[])

	useEffect(() => {
		onChange(values)
	}, [values])

	return (
		<div>
			{effect.args.map((a, i) => (
				<Arg
					key={i}
					arg={a}
					card={card}
					cardIndex={cardIndex}
					cardState={cardState}
					onChange={v => {
						setValues(values => {
							const updated = [...values]
							updated[i] = v

							return updated
						})
					}}
				/>
			))}
		</div>
	)
}
