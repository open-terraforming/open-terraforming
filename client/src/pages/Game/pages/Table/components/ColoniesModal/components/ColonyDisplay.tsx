import { Button, Tooltip } from '@/components'
import { Flex } from '@/components/Flex/Flex'
import { useApi } from '@/context/ApiContext'
import { useLocale } from '@/context/LocaleContext'
import { useAppStore, useToggle } from '@/utils/hooks'
import {
	faArrowLeft,
	faBuilding,
	faSpaceShuttle,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { buildColony, tradeWithColony } from '@shared/actions'
import { ColoniesLookupApi } from '@shared/expansions/colonies/ColoniesLookupApi'
import {
	canBuildColony,
	canTradeWithColony,
	canTradeWithColonyUsingResource,
	getColonyTradeCostSymbols,
} from '@shared/expansions/colonies/utils'
import { ColonyState, PlayerStateValue } from '@shared/index'
import { PlayerActionType } from '@shared/player-actions'
import { failure, isFailure, isOk } from '@shared/utils'
import { darken } from 'polished'
import { Fragment, ReactNode } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { Symbols } from '../../CardView/components/Symbols'
import { ColonyTradeModal } from './ColonyTradeModal'

type Props = {
	index: number
	colony: ColonyState
	freeTradePick?: boolean
	freeColonizePick?: boolean
	allowDuplicateColonies?: boolean
	noActions?: boolean
	justTradedStep?: number
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
	noActions,
	justTradedStep,
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

	const canTrade = noActions
		? failure('')
		: canTradeWithColony({
				player,
				game,
				colony,
			})

	const canTradeWithAnyResource =
		!noActions &&
		(['money', 'titan', 'energy'] as const).some((res) =>
			isOk(
				canTradeWithColonyUsingResource({
					player,
					game,
					colony,
					resource: res,
				}),
			),
		)

	const canColonize = noActions
		? failure('')
		: canBuildColony({
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

	const getStepTooltipContent = (i: number) => {
		const content: ReactNode[] = []

		if (i === colony.step) {
			content.push(
				<div key={0}>
					{
						"Current trade step, you'll receive this when trading with this colony"
					}
				</div>,
			)
		}

		if (i === colony.playersAtSteps.length) {
			content.push(
				<div key={1}>
					{'The colony income step will never go below this value'}
				</div>,
			)
		}

		if (i === justTradedStep) {
			content.push(<div key={2}>{'The step traded right now'}</div>)
		}

		return content.length > 0 ? <>{content}</> : undefined
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
						<Tooltip content={getStepTooltipContent(i)}>
							<SlotLabel
								$isCurrent={i === colony.step}
								$isDisabled={i < colony.playersAtSteps.length}
								$isStop={i === colony.playersAtSteps.length}
								$isHighlighted={i === justTradedStep}
							>
								<Symbols symbols={[s]} />
								{i === justTradedStep && (
									<ShiftArrow>
										<FontAwesomeIcon icon={faArrowLeft} />{' '}
										<ShiftArrowLine
											style={{
												width: (justTradedStep - colony.step - 1) * 3 + 'rem',
											}}
										/>
									</ShiftArrow>
								)}
							</SlotLabel>
						</Tooltip>
					</Slot>
				))}
			</Slots>

			{!noActions && (
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
									tooltip={
										isFailure(canColonize) ? canColonize.error : undefined
									}
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
			)}
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

const popOut = keyframes`
	0% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.2);
	}
	100% {
		transform: scale(1);
	}
`

const SlotLabel = styled.div<{
	$isCurrent: boolean
	$isDisabled: boolean
	$isStop: boolean
	$isHighlighted: boolean
}>`
	margin-left: 2px;
	margin-top: 2px;
	border: 2px solid transparent;
	width: 3rem;
	box-sizing: border-box;
	position: relative;

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

	${({ $isStop, theme }) =>
		$isStop &&
		css`
			border: 2px solid ${theme.colors.border};
		`}

	${({ $isHighlighted, theme }) =>
		$isHighlighted &&
		css`
			border: 2px solid ${darken(0.05, theme.colors.border)};
			background-color: ${darken(0.1, theme.colors.border)};
			animation-name: ${popOut};
			animation-duration: 0.5s;
			animation-iteration-count: 1;
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

const ShiftArrow = styled.div`
	position: absolute;
	right: 100%;
	top: 50%;
	transform: translate(0, -50%);
	display: flex;
	align-items: center;
`

const ShiftArrowLine = styled.div`
	height: 2px;
	background: ${({ theme }) => theme.colors.text};
`
