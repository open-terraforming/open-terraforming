import { Button, Tooltip } from '@/components'
import { Flex } from '@/components/Flex/Flex'
import { useApi } from '@/context/ApiContext'
import { useLocale } from '@/context/LocaleContext'
import { useAppStore, useToggle } from '@/utils/hooks'
import { faBuilding, faSpaceShuttle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { buildColony, tradeWithColony } from '@shared/actions'
import { ColoniesLookupApi } from '@shared/expansions/colonies/ColoniesLookupApi'
import {
	canBuildColony,
	canTradeWithColony,
	canTradeWithColonyUsingResource,
	getColonyTradeCostSymbols,
} from '@shared/expansions/colonies/utils'
import { ColonyState, PlayerStateValue } from '@shared/game'
import { PlayerActionType } from '@shared/player-actions'
import { isFailure, isOk } from '@shared/utils'
import { Fragment } from 'react'
import styled, { css } from 'styled-components'
import { Symbols } from '../../CardView/components/Symbols'
import { ColonyTradeModal } from './ColonyTradeModal'

type Props = {
	index: number
	colony: ColonyState
	freeTradePick?: boolean
	freeColonizePick?: boolean
	allowDuplicateColonies?: boolean
	customAction?: (colonyIndex: number) => {
		enabled: boolean
		perform: () => void
		label: string
	}
}

export const ColonyDisplay = ({
	freeTradePick,
	freeColonizePick,
	allowDuplicateColonies,
	index,
	colony,
	customAction,
}: Props) => {
	const game = useAppStore((s) => s.game.state)
	const player = useAppStore((s) => s.game.player)
	const pending = useAppStore((s) => s.game.pendingAction)
	const players = useAppStore((s) => s.game.playerMap)
	const info = ColoniesLookupApi.get(colony.code)
	const api = useApi()
	const [isTrading, toggleTrading] = useToggle()
	const t = useLocale()

	const canTradeCurrently =
		player.state === PlayerStateValue.Playing &&
		(!pending || pending.type === PlayerActionType.TradeWithColony)

	const canColonizeCurrently =
		player.state === PlayerStateValue.Playing &&
		(!pending || pending.type === PlayerActionType.BuildColony)

	const canTrade = canTradeWithColony({
		player,
		game,
		colony,
	})

	const canTradeWithAnyResource = (['money', 'titan', 'energy'] as const).some(
		(res) =>
			isOk(
				canTradeWithColonyUsingResource({
					player,
					game,
					colony,
					resource: res,
				}),
			),
	)

	const canColonize = canBuildColony({
		game,
		player,
		colony,
		forFree: freeColonizePick,
		allowDuplicates: allowDuplicateColonies,
	})

	const customActionRendered = customAction && customAction(index)

	const handleColonize = () => {
		api.send(buildColony(index))
	}

	const handleFreeTrade = () => {
		api.send(tradeWithColony(index, 'money'))
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
				<TitleName>{t.colonies[info.code]}</TitleName>
			</Title>

			<Info>
				<div>
					<Tooltip content="Bonus which every player with colony here receives if somebody trades with this colony">
						<Flex>
							<div>Trade bonus:</div>
							<div>
								<Symbols symbols={info.incomeBonus.symbols} />
							</div>
						</Flex>
					</Tooltip>

					<Tooltip content="Income you'll receive when trading with this colony, determined by the current trade step below">
						<Flex>
							<div>Trade income:</div>
							<div>
								<Symbols symbols={info.tradeIncome.symbols} />
							</div>
						</Flex>
					</Tooltip>
				</div>
				<div style={{ marginLeft: 'auto' }}>
					{typeof colony.currentlyTradingPlayer === 'number' && (
						<Tooltip content="Currently docked trade fleet">
							<FleetDisplay>
								<FleetIcon
									style={{
										color: players[colony.currentlyTradingPlayer].color,
									}}
								>
									<FontAwesomeIcon icon={faSpaceShuttle} />
								</FleetIcon>
								{players[colony.currentlyTradingPlayer].name}
							</FleetDisplay>
						</Tooltip>
					)}
				</div>
			</Info>

			<Slots>
				{info.tradeIncome.slots.map((s, i) => (
					<Slot key={i}>
						{i < 3 && (
							<SlotRect>
								{colony.playersAtSteps[i] !== undefined ? (
									<Tooltip content={players[colony.playersAtSteps[i]].name}>
										<PlayerColony
											style={{
												color: players[colony.playersAtSteps[i]].color,
											}}
										>
											<FontAwesomeIcon icon={faBuilding} />
										</PlayerColony>
									</Tooltip>
								) : (
									info.colonizeBonus[i] && (
										<Tooltip content="You'll receive this bonus when placing colony here">
											<Symbols symbols={info.colonizeBonus[i].symbols} />
										</Tooltip>
									)
								)}
							</SlotRect>
						)}
						<Tooltip
							content={
								i === colony.step &&
								"Current trade step, you'll receive this when trading with this colony"
							}
						>
							<SlotLabel
								$isCurrent={i === colony.step}
								$isDisabled={i < colony.playersAtSteps.length}
							>
								<Symbols symbols={[s]} />
							</SlotLabel>
						</Tooltip>
					</Slot>
				))}
			</Slots>

			<Actions>
				{customActionRendered ? (
					<Action
						disabled={!customActionRendered.enabled}
						onClick={customActionRendered.perform}
						noClip
					>
						{customActionRendered.label}
					</Action>
				) : (
					<>
						{!freeColonizePick && (
							<Action
								disabled={
									!canTradeWithAnyResource ||
									!canTradeCurrently ||
									!isOk(canTrade)
								}
								tooltip={
									isFailure(canTrade)
										? canTrade.error
										: !canTradeWithAnyResource
											? 'No resources to trade with'
											: undefined
								}
								onClick={freeTradePick ? handleFreeTrade : toggleTrading}
								noClip
							>
								<Flex>
									{!freeTradePick &&
										getColonyTradeCostSymbols({ player, game, colony }).map(
											(s, i) => (
												<Fragment key={i}>
													{i !== 0 && ' / '}
													<Symbols symbols={[s]} />
												</Fragment>
											),
										)}
									Trade
								</Flex>
							</Action>
						)}{' '}
						{!freeTradePick && (
							<Action
								disabled={!canColonizeCurrently || !isOk(canColonize)}
								tooltip={isFailure(canColonize) ? canColonize.error : undefined}
								onClick={handleColonize}
								noClip
							>
								{!freeColonizePick && (
									<Symbols symbols={[{ resource: 'money', count: 17 }]} />
								)}{' '}
								Colonize
							</Action>
						)}
					</>
				)}
			</Actions>
		</Container>
	)
}

const PlayerColony = styled.div`
	width: 1rem;
	height: 1rem;
`

const Container = styled.div`
	border: 2px solid ${({ theme }) => theme.colors.border};
	margin: 0.5rem;
	display: flex;
	flex-direction: column;
`

const Title = styled.div`
	background-color: ${({ theme }) => theme.colors.border};
	display: flex;
	text-transform: uppercase;
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
	border-left-width: 0;
	width: 3rem;
	height: 2rem;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
`

const Slot = styled.div`
	&:first-child ${SlotRect} {
		border-left-width: 2px;
	}
`

const Slots = styled(Flex)`
	padding: 0 0.5rem;
	align-items: flex-end;
`

const SlotLabel = styled.div<{ $isCurrent: boolean; $isDisabled: boolean }>`
	margin-left: 2px;
	margin-top: 2px;
	border: 2px solid transparent;

	${({ $isCurrent, theme }) =>
		$isCurrent &&
		css`
			background-color: ${theme.colors.border};
		`}

	${({ $isDisabled }) =>
		$isDisabled &&
		css`
			opacity: 0.5;
		`}
`

const Info = styled(Flex)`
	padding: 0.5rem;
	flex: 1;
`

const FleetDisplay = styled.div`
	margin-left: auto;
	text-align: center;
	border: 2px solid ${({ theme }) => theme.colors.border};
	padding: 0.25rem;
`

const FleetIcon = styled.div`
	font-size: 150%;
`
