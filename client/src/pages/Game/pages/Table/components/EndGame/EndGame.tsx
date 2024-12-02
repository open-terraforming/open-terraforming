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
	}, 300)

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

	const barHeight = 600

	return (
		<Modal header="Game ended" open={true} onClose={onClose}>
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
			<CharContainer>
				{(game?.players || []).map((player) => (
					<Place key={player.id}>
						<PlayerName>{player.name}</PlayerName>
						<Flex gap="1px">
							{player.victoryPoints
								.slice()
								.sort(
									(a, b) =>
										vpOrder.indexOf(a.source) - vpOrder.indexOf(b.source),
								)
								.map((v, i) => (
									<Tooltip
										key={`${v.source}_${i}`}
										content={`${vpText(v.source, v)}: ${v.amount}`}
									>
										<Bar
											$selected={
												selected?.player?.id === player.id &&
												selected?.source === v.source
											}
											onClick={() => setSelected({ source: v.source, player })}
											key={`${v.source}_${i}`}
											style={{
												backgroundColor: rgba(vpToColor[v.source], 0.9),
												width:
													(sources.includes(v.source)
														? (v.amount / maxValue) * barHeight
														: 0) + 'px',
											}}
										/>
									</Tooltip>
								))}
						</Flex>
						<AnimatedNumber value={chart[player.id][1]} delay={3000} />
					</Place>
				))}
			</CharContainer>

			{selected && (
				<VpCategoryDetail category={selected.source} player={selected.player} />
			)}
		</Modal>
	)
}

const CharContainer = styled.div`
	text-align: center;
	position: relative;
	width: 900px;
	margin: 1.5rem 0;
`

const Place = styled.div`
	text-align: center;
	align-items: center;
	transition: left 3s;
	height: 2rem;
	display: flex;
	gap: 0.25rem;
`

const Bar = styled.div<{ $selected: boolean }>`
	transition: width 3s;
	background: ${({ theme }) => theme.colors.border};
	height: 1.5rem;
	box-sizing: border-box;

	${({ $selected }) =>
		$selected &&
		css`
			border: 0.2rem solid ${({ theme }) => theme.colors.primary.base};
		`}

	&:hover {
		border: 0.2rem solid ${({ theme }) => theme.colors.primary.base};
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

const Value = styled.div`
	animation-name: ${FadeIn};
	animation-duration: 500ms;
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
