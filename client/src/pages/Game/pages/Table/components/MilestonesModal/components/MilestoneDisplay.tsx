import { Button } from '@/components'
import { colors } from '@/styles'
import { useAppStore } from '@/utils/hooks'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { PlayerState } from '@shared/index'
import { Milestone } from '@shared/milestones'
import React, { useMemo } from 'react'
import styled from 'styled-components'

type Props = {
	milestone: Milestone
	canAfford: boolean
	owner?: PlayerState
	cost?: number
	onBuy: (milestone: Milestone) => void
}

export const MilestoneDisplay = ({
	milestone,
	canAfford,
	onBuy,
	owner,
	cost
}: Props) => {
	const game = useAppStore(state => state.game.state)
	const player = useAppStore(state => state.game.player)

	const value = useMemo(
		() => (game && player ? milestone.getValue(game, player) : 0),
		[game, player]
	)

	const reached = value >= milestone.limit

	if (!game || !player) {
		return <>No game / player</>
	}

	return (
		<E>
			<Head>
				<Title>{milestone.title}</Title>
				{(cost !== undefined || owner) && (
					<Button
						disabled={!reached || !canAfford || !!owner}
						onClick={() => onBuy(milestone)}
						icon={owner ? faCheck : undefined}
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
	background: ${colors.border};

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
	border: 2px solid ${colors.border};
	border-top: 0;
	flex: 1;
	border-right: 0;
`

const Status = styled.div`
	padding: 0.5rem 0.5rem;
	background: ${colors.border};
`
