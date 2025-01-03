import { Button } from '@/components'
import { useAppStore } from '@/utils/hooks'
import { faCheck, faMedal, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Milestone } from '@shared/milestones'
import { ReactNode, useMemo } from 'react'
import styled from 'styled-components'

type Props = {
	milestone: Milestone
	canAfford?: boolean
	playing: boolean
	ownerId?: number
	currentPlayerId?: number
	cost?: number
	onBuy?: (milestone: Milestone) => void
	titleRight?: ReactNode
}

export const MilestoneDisplay = ({
	milestone,
	canAfford,
	onBuy,
	ownerId,
	cost,
	playing,
	currentPlayerId,
	titleRight,
}: Props) => {
	const game = useAppStore((state) => state.game.state)
	const players = useAppStore((state) => state.game.playerMap)
	const thisPlayerId = useAppStore((state) => state.game.playerId)
	const displayedPlayerId = currentPlayerId ?? thisPlayerId
	const player = displayedPlayerId ? players[displayedPlayerId] : null
	const owner = ownerId ? players[ownerId] : null

	const value = useMemo(
		() => (game && player ? milestone.getValue(game, player) : 0),
		[game, player],
	)

	const reached = value >= milestone.limit

	if (!game || !player) {
		return <>No game / player</>
	}

	return (
		<E>
			<Head>
				<Title>{milestone.title}</Title>
				{titleRight}
				{(cost !== undefined || owner) && (
					<Button
						noClip
						disabled={!playing || !reached || !canAfford || !!owner}
						onClick={() => onBuy?.(milestone)}
						icon={owner ? faCheck : reached ? faMedal : faTimes}
					>
						{owner
							? `Owned by ${owner.name}`
							: reached
								? `Buy for ${cost}`
								: 'Milestone not reached'}
					</Button>
				)}
			</Head>
			<Body>
				<Info>{milestone.description}</Info>
				<Status>
					{value} / {milestone.limit}
				</Status>
			</Body>
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

const Body = styled.div`
	display: flex;
	justify-content: space-between;
`

const Info = styled.div`
	padding: 0.5rem 0.5rem;
	border: 2px solid ${({ theme }) => theme.colors.border};
	border-top: 0;
	flex: 1;
	border-right: 0;
`

const Status = styled.div`
	padding: 0.5rem 0.5rem;
	background: ${({ theme }) => theme.colors.border};
`
