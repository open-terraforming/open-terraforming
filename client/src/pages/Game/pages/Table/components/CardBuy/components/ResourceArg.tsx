import { useAppStore } from '@/utils/hooks'
import { CardEffectArgument, Resource } from '@shared/cards'
import { useEffect } from 'react'
import { ArgContainer } from './ArgContainer'
import { ResourceInput } from './ResourceInput'

type Props = {
	arg: CardEffectArgument
	onChange: (v: number) => void
}

export const ResourceArg = ({ arg, onChange }: Props) => {
	const player = useAppStore((state) => state.game.player)

	useEffect(() => {
		onChange(0)
	}, [])

	if (!player || !arg.resource) {
		return <>No player or no resource for arg</>
	}

	return (
		<ArgContainer>
			{arg.descriptionPrefix}
			<ResourceInput
				res={arg.resource as Resource}
				onChange={(v) => onChange(v)}
				max={
					arg.maxAmount !== undefined && arg.maxAmount !== 0
						? Math.min(arg.maxAmount, player[arg.resource])
						: player[arg.resource]
				}
			/>
			{arg.descriptionPostfix}
		</ArgContainer>
	)
}
