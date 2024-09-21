import { Button } from '@/components'
import { Modal } from '@/components/Modal/Modal'
import { useApi } from '@/context/ApiContext'
import { useAppStore } from '@/utils/hooks'
import { tradeWithColony } from '@shared/actions'
import {
	canTradeWithColonyUsingResource,
	getColonyTradeCostSymbols,
} from '@shared/expansions/colonies/utils'
import { ColonyState } from '@shared/index'
import { isFailure } from '@shared/utils'
import { Symbols } from '../../CardView/components/Symbols'
import { useLocale } from '@/context/LocaleContext'
import styled from 'styled-components'

type Props = {
	colonyIndex: number
	colony: ColonyState
	onClose: () => void
}

export const ColonyTradeModal = ({ colony, colonyIndex, onClose }: Props) => {
	const api = useApi()
	const game = useAppStore((s) => s.game.state)
	const player = useAppStore((s) => s.game.player)
	const t = useLocale()

	const handleTrade = (resource: 'money' | 'titan' | 'energy') => () => {
		api.send(tradeWithColony(colonyIndex, resource))
		onClose()
	}

	const tradeOptions = getColonyTradeCostSymbols({ player, game, colony }).map(
		(s) => ({
			resource: s.resource as 'money' | 'titan' | 'energy',
			symbols: [s],
		}),
	)

	return (
		<Modal header="Trade" open onClose={onClose}>
			<Container>
				<p>Trade with {t.colonies[colony.code]}</p>

				{tradeOptions.map(({ resource, symbols }) => (
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
						Use <Symbols symbols={symbols} />
					</Button>
				))}
			</Container>
		</Modal>
	)
}

const Container = styled.div`
	margin: 1rem 0;
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
`
