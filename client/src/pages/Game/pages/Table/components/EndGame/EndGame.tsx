import { Tooltip } from '@/components'
import { AnimatedNumber } from '@/components/AnimatedNumber/AnimatedNumber'
import { Flex } from '@/components/Flex/Flex'
import { Modal } from '@/components/Modal/Modal'
import { useAppStore, useInterval } from '@/utils/hooks'
import { CompetitionType } from '@shared/competitions'
import { PlayerState, VictoryPoints, VictoryPointsSource } from '@shared/index'
import { MilestoneType } from '@shared/milestones'
import { rgba } from 'polished'
import { useMemo, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { VpCategoryDetail } from './components/VpCategoryDetail'
import { ClippedBox } from '@/components/ClippedBox'
import { ClippedBoxTitle } from '@/components/ClippedBoxTitle'
import { Box } from '@/components/Box'
import { contrastColor } from '@/utils/contrastColor'
import { VpCount } from './components/VpCount'

type Props = {
	onClose: () => void
}

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

	const [opacity, setOpacity] = useState(1)
	const [waiting, setWaiting] = useState(vpOrder.slice(1))
	const [sources, setSources] = useState(vpOrder.slice(0, 1))

	const [selected, setSelected] = useState<{
		source: VictoryPointsSource
		player: PlayerState
	} | null>(null)

	useInterval(() => {
		if (waiting.length > 0) {
			setSources((s) => [...s, waiting[0]])
			setWaiting((s) => s.slice(1))
		}
	}, 3000)

	const chart = useMemo(
		(): Record<number, [number, number]> =>
			game
				? game.players
						.map((player) => {
							const score = player.victoryPoints
								.filter((s) => sources.includes(s.source))
								.reduce((acc, v) => acc + v.amount, 0)

							return [player, score] as const
						})
						.sort((a, b) => b[1] - a[1])
						.reduce(
							(acc, item, index) => {
								acc[item[0].id] = [index, item[1]]

								return acc
							},
							{} as Record<number, [number, number]>,
						)
				: {},
		[game, sources],
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
			header="End game stats"
			open={true}
			onClose={onClose}
			contentStyle={{ opacity }}
		>
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
								{vps.map(([source, amount], i) => {
									const isSelected = selected?.source === source

									return (
										<Tooltip key={`${source}_${i}`} content={vpText(source)}>
											<Bar
												$selected={isSelected}
												onClick={() => setSelected({ source, player })}
												key={`${source}_${i}`}
												style={{
													color: contrastColor({ bgColor: vpToColor[source] }),
													backgroundColor: rgba(vpToColor[source], 0.9),
													width:
														(sources.includes(source)
															? (amount / maxValue) * barWidth
															: 0) + 'px',
												}}
											>
												{waiting.length === 0 && (
													<FadeInValue>{amount}</FadeInValue>
												)}
											</Bar>
										</Tooltip>
									)
								})}
							</Flex>
							<AnimatedNumber value={chart[player.id][1]} delay={3000} />
						</Place>
					)
				})}
			</CharContainer>

			{selected && (
				<>
					<SelectedTitle innerSpacing>{vpText(selected.source)}</SelectedTitle>
					<Flex wrap="wrap" gap="1rem" justify="center" align="stretch">
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
					</Flex>
				</>
			)}
		</Modal>
	)
}

const PlayerDisplay = styled(ClippedBox)`
	width: 280px;
`

const CharContainer = styled.div`
	text-align: center;
	position: relative;
	width: 900px;
	margin: 1.5rem 0;
`

const SelectedTitle = styled(ClippedBox)`
	text-align: center;
	margin: 1rem auto 0.25rem auto;
	text-transform: uppercase;
	.inner {
		background: ${({ theme }) => theme.colors.border};
	}
`

const SelectedPlayerTitle = styled(ClippedBoxTitle)`
	text-transform: uppercase;
`

const Place = styled.div`
	text-align: center;
	align-items: center;
	transition: top 3s;
	height: 25px;
	display: flex;
	gap: 0.25rem;
	position: absolute;
`

const Bar = styled.div<{ $selected: boolean }>`
	transition: width 3s;
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
			/*background-color: #fff !important;*/
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
