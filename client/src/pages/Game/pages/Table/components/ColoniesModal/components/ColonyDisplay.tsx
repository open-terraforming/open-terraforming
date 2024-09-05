import { Button, Tooltip } from '@/components'
import { Flex } from '@/components/Flex/Flex'
import { useApi } from '@/context/ApiContext'
import { colonizeColony, tradeWithColony } from '@shared/actions'
import { ColoniesLookupApi } from '@shared/colonies/ColoniesLookupApi'
import { ColonyState } from '@shared/game'
import styled from 'styled-components'
import { Symbols } from '../../CardView/components/Symbols'
import { useAppStore } from '@/utils/hooks'
import { darken } from 'polished'
import { canTradeWithColony, isFail, isOk } from '@shared/utils'

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

	const canTrade = canTradeWithColony({
		player,
		game,
		colony,
	})

	const handleColonize = () => {
		api.send(colonizeColony(index))
	}

	const handleTrade = () => {
		api.send(tradeWithColony(index))
	}

	return (
		<Container>
			<Title>
				<TitleName>{info.code}</TitleName>
				<Actions>
					<Action onClick={handleColonize}>
						<Symbols symbols={[{ resource: 'money', count: 17 }]} /> Colonize
					</Action>
					<Action
						disabled={!isOk(canTrade)}
						tooltip={isFail(canTrade) ? canTrade.error : undefined}
						onClick={handleTrade}
					>
						<Symbols symbols={[{ resource: 'money', count: 9 }]} />
						Trade
					</Action>
				</Actions>
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
						{colony.currentlyTradingPlayer !== undefined
							? players[colony.currentlyTradingPlayer].name
							: 'nobody'}
					</div>
				</div>
			</Info>

			<Slots>
				{info.tradeIncome.slots.map((s, i) => (
					<Slot key={i}>
						<SlotBonus>
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
						</SlotBonus>
						<SlotLabel>
							<Symbols symbols={[s]} />
						</SlotLabel>
					</Slot>
				))}
			</Slots>
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
	margin-left: auto;
`

const Action = styled(Button)`
	padding: 0.2rem 0.5rem;
`

const SlotBonus = styled.div`
	border: 2px solid ${({ theme }) => theme.colors.border};
	border-right-width: 0;
	width: 3rem;
	height: 2.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
`

const Slot = styled.div`
	&:last-child ${SlotBonus} {
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
