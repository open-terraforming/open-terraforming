import { usePlayerState } from '@/utils/hooks'
import { CardEffectArgument, Resource } from '@shared/cards'
import { resourceProduction } from '@shared/cards/utils'
import { useEffect, useState } from 'react'
import { ArgContainer } from './ArgContainer'
import { ResourceInput } from './ResourceInput'

type Props = {
	arg: CardEffectArgument
	onChange: (v: number) => void
}

export const ProductionArg = ({ arg, onChange }: Props) => {
	const [amount, setAmount] = useState(0)
	const player = usePlayerState()
	const res = arg.resource ?? 'money'

	useEffect(() => {
		onChange(amount)
	}, [amount])

	return (
		<ArgContainer>
			<span>{arg.descriptionPrefix}</span>

			<ResourceInput
				production
				min={1}
				res={arg.resource as Resource}
				max={Math.max(arg.maxAmount || player[resourceProduction[res]])}
				onChange={(v) => setAmount(v)}
			/>
			<span>{arg.descriptionPostfix}</span>
		</ArgContainer>
	)
}
