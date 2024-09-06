import { Button, Tooltip } from '@/components'
import { Flex } from '@/components/Flex/Flex'
import { useApi } from '@/context/ApiContext'
import { useAppStore, useToggle } from '@/utils/hooks'
import { colonizeColony } from '@shared/actions'
import { ColoniesLookupApi } from '@shared/expansions/colonies/ColoniesLookupApi'
import { ColonyState } from '@shared/game'
import {
	canColonizeColony,
	canTradeWithColony,
	isFailure,
	isOk,
} from '@shared/utils'
import { darken } from 'polished'
import styled from 'styled-components'
import { Symbols } from '../../CardView/components/Symbols'
import { ColonyTradeModal } from './ColonyTradeModal'

type Props = {
	index: number
	colony: ColonyState
}

export const ColonyDisplay = ({ index, colony }: Props) => {
	const game = useAppStore((s) => s.game.state)
	const player = useAppStore((s) => s.game.player)
	const players = game.players
	const info = ColoniesLookupApi.get(colony.code)
	const api = useApi()
	const [isTrading, toggleTrading] = useToggle()

	const canTrade = canTradeWithColony({
		player,
		game,
		colony,
	})

	const canColonize = canColonizeColony({
		game,
		player,
		colony,
	})

	const handleColonize = () => {
		api.send(colonizeColony(index))
	}

	return (
		<Container>
			{isTrading && (
				<ColonyTradeModal
					onClose={toggleTrading}
					colony={colony}
					colonyIndex={index}
				/>
			)}

			<Title>
				<TitleName>{info.code}</TitleName>
			</Title>

			<Info>
				<div>
					<Flex>
						<div>Trade bonus:</div>
						<div>
							<Symbols symbols={info.incomeBonus.symbols} />
						</div>
					</Flex>

					<Flex>
						<div>Trade income:</div>
						<div>
							<Symbols symbols={info.tradeIncome.symbols} />
						</div>
					</Flex>
				</div>
				<div style={{ marginLeft: 'auto' }}>
					<div>Current step: {colony.step}</div>
					<div>
						Trading with:{' '}
						{typeof colony.currentlyTradingPlayer === 'number'
							? players[colony.currentlyTradingPlayer].name
							: 'nobody'}
					</div>
				</div>
			</Info>

			<Slots>
				{info.tradeIncome.slots.map((s, i) => (
					<Slot key={i}>
						<SlotRect>
							{colony.playersAtSteps[i] !== undefined ? (
								<Tooltip content={players[colony.playersAtSteps[i]].name}>
									<PlayerColony
										style={{
											backgroundColor: players[colony.playersAtSteps[i]].color,
											borderColor: darken(
												0.2,
												players[colony.playersAtSteps[i]].color,
											),
										}}
									/>
								</Tooltip>
							) : (
								info.colonizeBonus[i] && (
									<Symbols symbols={info.colonizeBonus[i].symbols} />
								)
							)}
							{i === colony.step && <SlotIndicator />}
						</SlotRect>
						<SlotLabel>
							<Symbols symbols={[s]} />
						</SlotLabel>
					</Slot>
				))}
			</Slots>

			<Actions>
				<Action
					disabled={!isOk(canTrade)}
					tooltip={isFailure(canTrade) ? canTrade.error : undefined}
					onClick={toggleTrading}
					noClip
				>
					<Flex>
						<Symbols symbols={[{ resource: 'money', count: 9 }]} /> /{' '}
						<Symbols symbols={[{ resource: 'energy', count: 3 }]} /> /{' '}
						<Symbols symbols={[{ resource: 'titan', count: 3 }]} />
						Trade
					</Flex>
				</Action>{' '}
				<Action
					disabled={!isOk(canColonize)}
					tooltip={isFailure(canColonize) ? canColonize.error : undefined}
					onClick={handleColonize}
					noClip
				>
					<Symbols symbols={[{ resource: 'money', count: 17 }]} /> Colonize
				</Action>
			</Actions>
		</Container>
	)
}

const PlayerColony = styled.div`
	width: 1rem;
	height: 1rem;
	border: 2px solid #000;
`

const Container = styled.div`
	border: 2px solid ${({ theme }) => theme.colors.border};
	margin: 0.5rem 0;
`

const Title = styled.div`
	background-color: ${({ theme }) => theme.colors.border};
	display: flex;
`

const TitleName = styled.div`
	padding: 0.5rem;
`

const Actions = styled(Flex)`
	justify-content: flex-end;
	gap: 0.5rem;
	margin-top: 0.5rem;
`

const Action = styled(Button)`
	padding: 0.1rem 0.5rem;
`

const SlotRect = styled.div`
	border: 2px solid ${({ theme }) => theme.colors.border};
	border-right-width: 0;
	width: 3rem;
	height: 2.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
`

const Slot = styled.div`
	&:last-child ${SlotRect} {
		border-right-width: 2px;
	}
`

const Slots = styled(Flex)`
	padding: 0 0.5rem;
`

const SlotLabel = styled.div``

const Info = styled(Flex)`
	padding: 0.5rem;
`

const SlotIndicator = styled.div`
	position: absolute;
	top: 0rem;
	right: 0rem;
	width: 0.5rem;
	height: 0.5rem;
	background-color: #bbb;
`
