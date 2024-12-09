import { DelegateIcon } from '@/components/DelegateIcon'
import { PlayerId } from '@shared/gameState'

type Props = {
	delegates: (PlayerId | null)[]
}

export const DelegatesView = ({ delegates }: Props) => {
	return (
		<>
			{delegates
				.sort((a, b) => (a?.id ?? 0) - (b?.id ?? 0))
				.map((m, i) => (
					<DelegateIcon key={i} playerId={m?.id} />
				))}
		</>
	)
}
