import { Button } from '@/components'
import { Modal } from '@/components/Modal/Modal'
import { useApi } from '@/context/ApiContext'
import { useAppStore } from '@/utils/hooks'
import { tradeWithColony } from '@shared/actions'
import { ColonyState } from '@shared/game'
import { canTradeWithColonyUsingResource, isFailure } from '@shared/utils'
import { Symbols } from '../../CardView/components/Symbols'

type Props = {
	colonyIndex: number
	colony: ColonyState
	onClose: () => void
}

const TRADE_OPTIONS = [
	{ resource: 'money', cost: 9 },
	{ resource: 'energy', cost: 3 },
	{ resource: 'titan', cost: 3 },
] as const

export const ColonyTradeModal = ({ colony, colonyIndex, onClose }: Props) => {
	const api = useApi()
	const game = useAppStore((s) => s.game.state)
	const player = useAppStore((s) => s.game.player)

	const handleTrade = (resource: 'money' | 'titan' | 'energy') => () => {
		api.send(tradeWithColony(colonyIndex, resource))
		onClose()
	}

	return (
		<Modal header="Trade" open onClose={onClose}>
			<p>Trade with {colony.code}</p>

			{TRADE_OPTIONS.map(({ resource, cost }) => (
				<Button
					key={resource}
					onClick={handleTrade(resource)}
					disabled={isFailure(
						canTradeWithColonyUsingResource({
							player,
							game,
							colony,
							resource,
						}),
					)}
				>
					Use <Symbols symbols={[{ resource, count: cost }]} />
				</Button>
			))}
		</Modal>
	)
}
