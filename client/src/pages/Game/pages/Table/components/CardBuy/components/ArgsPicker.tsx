import { useState, useEffect } from 'react'
import {
	CardEffectArgumentType,
	CardEffect,
	CardEffectArgument,
} from '@shared/cards'
import { UsedCardState } from '@shared/index'
import { Arg } from './Arg'

type Props = {
	effect: CardEffect
	card: string
	cardState: UsedCardState
	handCardIndex?: number
	onChange: (args: CardEffectArgumentType[]) => void
}

export const ArgsPicker = ({
	effect,
	card,
	cardState,
	handCardIndex,
	onChange,
}: Props) => {
	const [values, setValues] = useState([] as CardEffectArgumentType[])

	useEffect(() => {
		onChange(values)
	}, [values])

	return (
		<div>
			{(effect.args as CardEffectArgument[]).map((a, i) => (
				<Arg
					key={i}
					arg={a}
					card={card}
					cardState={cardState}
					handCardIndex={handCardIndex}
					onChange={(v) => {
						setValues((values) => {
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
