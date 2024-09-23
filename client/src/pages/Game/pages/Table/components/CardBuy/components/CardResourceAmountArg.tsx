import { CardEffectArgument, CardResource, CardsLookupApi } from '@shared/cards'
import { useEffect, useState } from 'react'
import { ArgContainer } from './ArgContainer'
import { UsedCardState } from '@shared/index'
import { CardResourceInput } from './CardResourceInput'

type Props = {
	arg: CardEffectArgument
	cardState: UsedCardState
	onChange: (v: number) => void
}

export const CardResourceAmountArg = ({ arg, cardState, onChange }: Props) => {
	const [amount, setAmount] = useState(0)
	const cardData = CardsLookupApi.get(cardState.code)
	const res = cardData.resource ?? 'microbes'

	useEffect(() => {
		onChange(amount)
	}, [amount])

	return (
		<ArgContainer>
			<span>{arg.descriptionPrefix}</span>

			<CardResourceInput
				min={arg.minAmount ?? 1}
				res={cardData.resource as CardResource}
				max={cardState[res]}
				onChange={(v) => setAmount(v)}
			/>
			<span>{arg.descriptionPostfix}</span>
		</ArgContainer>
	)
}
