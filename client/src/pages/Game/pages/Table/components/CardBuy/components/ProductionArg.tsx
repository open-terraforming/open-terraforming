import { useAppStore, usePlayerState } from '@/utils/hooks'
import { CardEffectArgument, Resource } from '@shared/cards'
import { resourceProduction } from '@shared/cards/utils'
import { useEffect, useState } from 'react'
import { ArgContainer } from './ArgContainer'
import { ResourceInput } from './ResourceInput'
import { UsedCardState } from '@shared/game'

type Props = {
	arg: CardEffectArgument
	card: UsedCardState
	onChange: (v: number) => void
}

export const ProductionArg = ({ arg, card, onChange }: Props) => {
	const [amount, setAmount] = useState(0)
	const player = usePlayerState()
	const res = arg.resource ?? 'money'
	const game = useAppStore((state) => state.game.state)

	const maxAmount =
		arg.maxAmount !== undefined
			? typeof arg.maxAmount === 'number'
				? arg.maxAmount
				: arg.maxAmount({ player, card, game })
			: undefined

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
				max={Math.max(maxAmount || player[resourceProduction[res]])}
				onChange={(v) => setAmount(v)}
			/>
			<span>{arg.descriptionPostfix}</span>
		</ArgContainer>
	)
}
