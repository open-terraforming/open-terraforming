import { useAppStore } from '@/utils/hooks'
import { CardEffectArgument, Resource } from '@shared/cards'
import { useEffect } from 'react'
import { ArgContainer } from './ArgContainer'
import { ResourceInput } from './ResourceInput'
import { UsedCardState } from '@shared/index'

type Props = {
	arg: CardEffectArgument
	card: UsedCardState
	onChange: (v: number) => void
}

export const ResourceArg = ({ arg, onChange, card }: Props) => {
	const player = useAppStore((state) => state.game.player)
	const game = useAppStore((state) => state.game.state)

	const maxAmount =
		arg.maxAmount !== undefined
			? typeof arg.maxAmount === 'number'
				? arg.maxAmount
				: arg.maxAmount({ player, card, game })
			: undefined

	console.log({ maxAmount })

	useEffect(() => {
		onChange(0)
	}, [])

	if (!player || !arg.resource) {
		return <>No player or no resource for arg</>
	}

	return (
		<ArgContainer>
			<span>{arg.descriptionPrefix}</span>
			<ResourceInput
				res={arg.resource as Resource}
				onChange={(v) => onChange(v)}
				max={
					maxAmount !== undefined && maxAmount !== 0
						? Math.min(maxAmount, player[arg.resource])
						: player[arg.resource]
				}
			/>
			<span>{arg.descriptionPostfix}</span>
		</ArgContainer>
	)
}
