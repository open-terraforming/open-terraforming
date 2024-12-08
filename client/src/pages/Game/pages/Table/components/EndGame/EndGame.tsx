import { Button, Tooltip } from '@/components'
import { Box } from '@/components/Box'
import { ClippedBox } from '@/components/ClippedBox'
import { ClippedBoxTitle } from '@/components/ClippedBoxTitle'
import { Flex } from '@/components/Flex/Flex'
import { Modal } from '@/components/Modal/Modal'
import { setGameResultsShown } from '@/store/modules/game'
import { contrastColor } from '@/utils/contrastColor'
import { useAppDispatch, useAppStore, useInterval } from '@/utils/hooks'
import { faFastForward } from '@fortawesome/free-solid-svg-icons'
import { CompetitionType } from '@shared/competitions'
import { PlayerState, VictoryPoints, VictoryPointsSource } from '@shared/index'
import { MilestoneType } from '@shared/milestones'
import { rgba } from 'polished'
import { useMemo, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { VpCategoryDetail } from './components/VpCategoryDetail'
import { VpCount } from './components/VpCount'

type Props = {
	onClose: () => void
}

type ChartItem = Record<
	number,
	[
		number,
		{
			sum: number
			bySource: Record<VictoryPointsSource, number>
		},
	]
>

const vpOrder = [
	VictoryPointsSource.Rating,
	VictoryPointsSource.Cards,
	VictoryPointsSource.Forests,
	VictoryPointsSource.Cities,
	VictoryPointsSource.Milestones,
	VictoryPointsSource.Awards,
	VictoryPointsSource.PartyLeaders,
	VictoryPointsSource.Chairman,
]

const vpToColor = {
	[VictoryPointsSource.Rating]: '#BAD08C',
	[VictoryPointsSource.Cards]: '#FFFFFF',
	[VictoryPointsSource.Forests]: '#B8E238',
	[VictoryPointsSource.Cities]: '#FF952B',
	[VictoryPointsSource.Milestones]: '#FF0000',
	[VictoryPointsSource.Awards]: '#7B7BFF',
	[VictoryPointsSource.PartyLeaders]: '#FFD700',
	[VictoryPointsSource.Chairman]: '#8f7901',
} as const

const vpText = (vp: VictoryPointsSource, extra?: VictoryPoints) => {
	switch (vp) {
		case VictoryPointsSource.Rating:
			return 'Terraforming Rating'
		case VictoryPointsSource.Awards:
			return extra?.competition
				? `Award - ${CompetitionType[extra.competition]}`
				: 'Awards'
		case VictoryPointsSource.Milestones:
			return extra?.milestone
				? `Milestone - ${MilestoneType[extra.milestone]}`
				: 'Milestones'
		case VictoryPointsSource.Cards:
			return 'Cards'
		case VictoryPointsSource.Forests:
			return 'Forests'
		case VictoryPointsSource.Cities:
			return 'Cities'
		case VictoryPointsSource.PartyLeaders:
			return 'Party Leaders'
		case VictoryPointsSource.Chairman:
			return 'Chairman'
	}
}

export const EndGame = ({ onClose }: Props) => {
	const game = useAppStore((state) => state.game.state)
	const alreadyShown = useAppStore((state) => state.game.resultsShown)
	const dispatch = useAppDispatch()

	const [opacity, setOpacity] = useState(1)
	const [waiting, setWaiting] = useState(vpOrder.slice(1))
	const [sources, setSources] = useState(vpOrder.slice(0, 1))
	const [ratio, setRatio] = useState(0)

	const [selected, setSelected] = useState<{
		source: VictoryPointsSource
		player: PlayerState
	} | null>(null)

	useInterval(() => {
		if (waiting.length > 0) {
			setSources((s) => [...s, waiting[0]])
			setWaiting((s) => s.slice(1))
			setRatio(0)

			if (waiting.length === 1) {
				dispatch(setGameResultsShown(true))
			}
		}
	}, 3000)

	useInterval(() => {
		setRatio((r) => Math.min(1, r + 0.05))
	}, 100)

	const chart = useMemo(
		() =>
			game
				? game.players
						.map((player) => {
							const scoreItems = player.victoryPoints
								.filter((s) => sources.includes(s.source))
								.map(
									(v) =>
										[
											v.source,
											v.amount *
												(sources[sources.length - 1] === v.source ? ratio : 1),
										] as const,
									0,
								)

							const scoreSum = scoreItems.reduce((acc, s) => acc + s[1], 0)

							const bySource = scoreItems.reduce(
								(acc, [source, amount]) => {
									if (!acc[source]) {
										acc[source] = 0
									}

									acc[source] += amount

									return acc
								},
								{} as Record<VictoryPointsSource, number>,
							)

							return [player, bySource, scoreSum] as const
						})
						.sort((a, b) => b[2] - a[2])
						.reduce((acc: ChartItem, item, index) => {
							acc[item[0].id] = [index, { bySource: item[1], sum: item[2] }]

							return acc
						}, {})
				: ({} as ChartItem),
		[game, sources, ratio],
	)

	const maxValue = useMemo(
		() =>
			game
				? game.players
						.map((p) => p.victoryPoints.reduce((acc, s) => acc + s.amount, 0))
						.reduce((acc, p) => (p > acc ? p : acc), 0)
				: 1,
		[game],
	)

	const barWidth = 600
	const barHeight = 25
	const barPadding = 8

	return (
		<Modal
			header={
				<>
					<span>End game stats</span>
					{alreadyShown && waiting.length > 0 && (
						<Box $ml="auto">
							<FastForward
								icon={faFastForward}
								onClick={() => {
									setSources((s) => [...s, ...waiting])
									setWaiting([])
								}}
							>
								Fast Forward
							</FastForward>
						</Box>
					)}
				</>
			}
			open={true}
			onClose={onClose}
			contentStyle={{ opacity }}
			bodyStyle={{ padding: 0 }}
		>
			<Flex justify="center" direction="column">
				{sources.length > 0 && (
					<Current>
						{sources.map((s) => (
							<Value key={s}>
								<Color style={{ background: vpToColor[s] }} />
								{vpText(s)}
							</Value>
						))}
					</Current>
				)}
				<CharContainer
					style={{
						height: game.players.length * (barHeight + barPadding),
					}}
				>
					{(game?.players || []).map((player) => {
						const vps = Array.from(
							player.victoryPoints
								.map((v) => [v.source, v.amount] as const)
								.reduce((acc, [source, amount]) => {
									acc.set(source, (acc.get(source) || 0) + amount)

									return acc
								}, new Map<VictoryPointsSource, number>())
								.entries(),
						).sort(([a], [b]) => vpOrder.indexOf(a) - vpOrder.indexOf(b))

						return (
							<Place
								key={player.id}
								style={{
									top: chart[player.id][0] * (barHeight + barPadding),
								}}
							>
								<PlayerName>{player.name}</PlayerName>
								<Flex gap="1px">
									{vps.map(([source], i) => {
										const isSelected = selected?.source === source
										const amount = chart[player.id][1].bySource[source]

										return (
											<Tooltip key={`${source}_${i}`} content={vpText(source)}>
												<Bar
													$selected={isSelected}
													onClick={() => setSelected({ source, player })}
													key={`${source}_${i}`}
													style={{
														color: contrastColor({
															bgColor: vpToColor[source],
														}),
														backgroundColor: rgba(vpToColor[source], 0.9),
														width:
															(sources.includes(source)
																? (amount / maxValue) * barWidth
																: 0) + 'px',
													}}
												>
													{waiting.length === 0 && ratio === 1 && (
														<FadeInValue>{amount}</FadeInValue>
													)}
												</Bar>
											</Tooltip>
										)
									})}
								</Flex>
								{Math.floor(chart[player.id][1].sum)}
							</Place>
						)
					})}
				</CharContainer>
			</Flex>

			{selected && (
				<DetailContainer>
					<DetailTitle>{vpText(selected.source)}</DetailTitle>
					<PlayersContainer $p={2} gap="1rem" justify="center" align="stretch">
						{game.players.map((player) => (
							<PlayerDisplay key={player.id}>
								<SelectedPlayerTitle $spacing>
									<Flex>
										<span>{player.name}</span>
										<PlayerTitleValue>
											<VpCount
												count={player.victoryPoints
													.filter((vp) => vp.source === selected.source)
													.reduce((acc, vp) => acc + vp.amount, 0)}
											/>
										</PlayerTitleValue>
									</Flex>
								</SelectedPlayerTitle>

								<Box $p={2}>
									<VpCategoryDetail
										category={selected.source}
										player={player}
										onOpacity={setOpacity}
									/>
								</Box>
							</PlayerDisplay>
						))}
					</PlayersContainer>
				</DetailContainer>
			)}
		</Modal>
	)
}

const DetailContainer = styled.div`
	overflow: auto;
`

const DetailTitle = styled.div`
	background-color: ${({ theme }) => theme.colors.border};
	text-align: center;
	padding: 0.5rem;
	text-transform: uppercase;
`

const PlayerDisplay = styled(ClippedBox)`
	width: 280px;
`

const CharContainer = styled.div`
	text-align: center;
	position: relative;
	width: 900px;
	margin: 1.5rem 0;
`

const SelectedPlayerTitle = styled(ClippedBoxTitle)`
	text-transform: uppercase;
`

const PlayersContainer = styled(Box)`
	overflow: auto;
`

const Place = styled.div`
	text-align: center;
	align-items: center;
	transition: top 2.5s;
	height: 25px;
	display: flex;
	gap: 0.25rem;
	position: absolute;
`

const Bar = styled.div<{ $selected: boolean }>`
	transition: width 100ms linear;
	background: ${({ theme }) => theme.colors.border};
	height: 25px;
	box-sizing: border-box;
	line-height: 25px;
	white-space: nowrap;
	overflow: hidden;
	cursor: pointer;
	color: #000;

	${({ $selected }) =>
		$selected &&
		css`
			transform: scale(1, 1.1);
			box-shadow: 0 0 5px #222;
		`}

	&:hover {
		opacity: 0.8;
	}
`

const Current = styled.div`
	display: flex;
	justify-content: center;
`

const FadeIn = keyframes`
	0% { opacity: 0; }
	100% { opacity: 1; }
`

const FadeInValue = styled.div`
	animation-name: ${FadeIn};
	animation-duration: 500ms;
`

const Value = styled(FadeInValue)`
	margin: 0 0.3rem;
	display: flex;
	align-items: center;
`

const Color = styled.div`
	width: 0.6rem;
	height: 0.6rem;
	margin-right: 0.2rem;
`

const PlayerName = styled.div`
	width: 7rem;
	flex-grow: 0;
	flex-shrink: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	text-align: right;
`

const PlayerTitleValue = styled.div`
	margin-left: auto;
`

const FastForward = styled(Button)`
	font-size: 1rem;
`
