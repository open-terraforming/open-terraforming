import { useState, useMemo, useEffect } from 'react'
import { ArgContainer } from './ArgContainer'
import { CardEffectArgument, Resource } from '@shared/cards'
import { useAppStore } from '@/utils/hooks'
import { resources } from '@shared/cards/utils'

type Props = {
	arg: CardEffectArgument
	onChange: (v: string) => void
}

export const ResourceTypeArg = ({ arg, onChange }: Props) => {
	const game = useAppStore((state) => state.game.state)
	const player = useAppStore((state) => state.game.player)

	const availableResources = useMemo(
		() =>
			resources.filter(
				(r) => !arg.resourceConditions.find((c) => !c({ player, game }, r)),
			),
		[],
	)

	const [selected, setSelected] = useState(availableResources[0])

	useEffect(() => {
		onChange(selected)
	}, [selected])

	return (
		<ArgContainer>
			<span>{arg.descriptionPrefix}</span>
			<select
				value={selected}
				onChange={(e) => setSelected(e.target.value as Resource)}
			>
				{availableResources.map((r) => (
					<option key={r} value={r}>
						{r}
					</option>
				))}
			</select>
			<span>{arg.descriptionPostfix}</span>
		</ArgContainer>
	)
}
