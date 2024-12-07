import { Button } from '@/components'
import { useAppStore } from '@/utils/hooks'
import { Competition } from '@shared/competitions'
import { PlayerState } from '@shared/index'
import { ReactNode, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { faCheck, faAward } from '@fortawesome/free-solid-svg-icons'

type Props = {
	competition: Competition
	playing: boolean
	highlightPlayerId?: number
	canAfford?: boolean
	freePick?: boolean
	sponsoredId?: number
	cost?: number
	onBuy?: (competition: Competition) => void
	titleRight?: ReactNode
}

export const CompetitionDisplay = ({
	competition,
	canAfford,
	onBuy,
	sponsoredId,
	playing,
	cost,
	freePick: pendingAction,
	highlightPlayerId,
	titleRight,
}: Props) => {
	const game = useAppStore((state) => state.game.state)
	const playerId = useAppStore((state) => state.game.playerId)
	const players = useAppStore((state) => state.game.playerMap)
	const sponsored = sponsoredId ? players[sponsoredId] : null

	const score = useMemo(
		() =>
			game
				? game.players.reduce((acc: Record<number, PlayerState[]>, p) => {
						const s = competition.getScore(game, p)

						if (!acc[s]) {
							acc[s] = []
						}

						acc[s].push(p)

						return acc
					}, {})
				: ({} as Record<number, PlayerState[]>),
		[game, competition],
	)

	if (!game || !playerId) {
		return <>No game / player</>
	}

	return (
		<E>
			<Head>
				<Title>{competition.title}</Title>
				{titleRight}
				{(cost !== undefined || sponsored) && (
					<Button
						noClip
						disabled={!playing || !canAfford || !!sponsored}
						onClick={() => onBuy?.(competition)}
						icon={sponsored ? faCheck : faAward}
					>
						{sponsored
							? `Sponsored by ${sponsored?.name}`
							: `Sponsor for ${pendingAction ? 'free' : cost}`}
					</Button>
				)}
			</Head>
			<ScoreList>
				{Object.entries(score)
					.sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
					.map(([score, players], index) => (
						<Position
							key={score}
							$highlight={
								highlightPlayerId === undefined
									? undefined
									: players.some((p) => p.id === highlightPlayerId)
							}
						>
							<Index>{index + 1}.</Index>
							<Name>{players.map((p) => p.name).join(', ')}</Name>
							<Score>{score}</Score>
						</Position>
					))}
			</ScoreList>
			<Info>{competition.description}</Info>
		</E>
	)
}

const E = styled.div`
	margin-bottom: 0.5rem;
`

const Head = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: ${({ theme }) => theme.colors.border};

	> button {
		margin: 0;
	}
`

const Title = styled.div`
	padding: 0.25rem 0.5rem;
	font-size: 125%;
`

const Info = styled.div`
	background: ${({ theme }) => theme.colors.border};
	padding: 0.5rem 0.5rem;
`

const ScoreList = styled.div`
	padding: 0.25rem 0.5rem;
	max-height: 4rem;
	overflow: auto;
	border-left: 2px solid ${({ theme }) => theme.colors.border};
	border-right: 2px solid ${({ theme }) => theme.colors.border};
`

const Position = styled.div<{ $highlight?: boolean }>`
	display: flex;
	align-items: center;
	margin-bottom: 0.25rem;
	&:last-child {
		margin-bottom: 0;
	}

	${({ $highlight }) =>
		$highlight === false &&
		css`
			opacity: 0.5;
		`}
`

const Index = styled.div`
	margin-right: 0.25rem;
`

const Name = styled.div``

const Score = styled.div`
	margin-left: auto;
	font-size: 150%;
`
