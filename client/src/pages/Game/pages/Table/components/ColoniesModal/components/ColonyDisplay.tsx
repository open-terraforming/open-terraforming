import { Button, Tooltip } from '@/components'
import { Flex } from '@/components/Flex/Flex'
import { useApi } from '@/context/ApiContext'
import { useAppStore, useToggle } from '@/utils/hooks'
import { colonizeColony } from '@shared/actions'
import { ColoniesLookupApi } from '@shared/expansions/colonies/ColoniesLookupApi'
import {
	canColonizeColony,
	canTradeWithColony,
	getColonyTradeCostSymbols,
} from '@shared/expansions/colonies/utils'
import { ColonyState } from '@shared/game'
import { isFailure, isOk } from '@shared/utils'
import { darken } from 'polished'
import { Fragment } from 'react'
import styled, { css } from 'styled-components'
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
						<SlotRect $isStarting={i === (info.startingStep ?? 1)}>
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
						</SlotRect>
						<SlotLabel $isCurrent={i === colony.step}>
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
						{getColonyTradeCostSymbols({ player, game, colony }).map((s, i) => (
							<Fragment key={i}>
								{i !== 0 && ' / '}
								<Symbols symbols={[s]} />
							</Fragment>
						))}
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

const SlotRect = styled.div<{ $isStarting?: boolean }>`
	border: 2px solid ${({ theme }) => theme.colors.border};
	border-right-width: 0;
	width: 3rem;
	height: 2.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;

	${({ $isStarting, theme }) =>
		$isStarting &&
		css`
			background-color: ${darken(0.05, theme.colors.border)};
		`}
`

const Slot = styled.div`
	&:last-child ${SlotRect} {
		border-right-width: 2px;
	}
`

const Slots = styled(Flex)`
	padding: 0 0.5rem;
`

const SlotLabel = styled.div<{ $isCurrent: boolean }>`
	margin-left: 2px;
	margin-top: 2px;

	${({ $isCurrent, theme }) =>
		$isCurrent &&
		css`
			background-color: ${theme.colors.border};
		`}
`

const Info = styled(Flex)`
	padding: 0.5rem;
`
