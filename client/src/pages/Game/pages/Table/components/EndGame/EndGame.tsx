import { Button } from '@/components'
import { Modal } from '@/components/Modal/Modal'
import { useAppStore, useInterval } from '@/utils/hooks'
import { VictoryPointsSource, VictoryPoints } from '@shared/index'
import { rgba } from 'polished'
import { useMemo, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { AnimatedNumber } from '@/components/AnimatedNumber/AnimatedNumber'
import { CompetitionType } from '@shared/competitions'
import { MilestoneType } from '@shared/milestones'

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

	const barWidth = game ? 100 / game.players.length : 0
	const barPadding = barWidth * 0.2
	const barHeight = 200

	return (
		<Modal
			header="Game ended"
			open={true}
			onClose={onClose}
			footer={<Button onClick={onClose}>Back to game</Button>}
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
			<CharContainer>
				{(game?.players || []).map((player) => (
					<Place
						key={player.id}
						style={{
							left: chart[player.id][0] * barWidth + barPadding + '%',
							width: barWidth - barPadding * 2 + '%',
						}}
					>
						<AnimatedNumber value={chart[player.id][1]} delay={3000} />
						{player.victoryPoints
							.slice()
							.sort(
								(a, b) => vpOrder.indexOf(b.source) - vpOrder.indexOf(a.source),
							)
							.map((v, i) => (
								<Bar
									key={`${v.source}_${i}`}
									style={{
										backgroundColor: rgba(vpToColor[v.source], 0.9),
										height:
											(sources.includes(v.source)
												? (v.amount / maxValue) * barHeight
												: 0) + 'px',
									}}
									title={`${vpText(v.source, v)}: ${v.amount}`}
								/>
							))}
						<PlayerName>{player.name}</PlayerName>
					</Place>
				))}
			</CharContainer>
		</Modal>
	)
}

const CharContainer = styled.div`
	text-align: center;
	position: relative;
	min-height: 250px;
	width: 30rem;
	margin: 1.5rem 0;
`

const Place = styled.div`
	text-align: center;
	transition: left 3s;
	position: absolute;
	top: 0;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
`

const Bar = styled.div`
	transition: height 3s;
	background: ${({ theme }) => theme.colors.border};
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
	margin-top: 0.5rem;
`
