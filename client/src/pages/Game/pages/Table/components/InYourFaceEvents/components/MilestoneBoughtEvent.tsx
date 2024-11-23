import { MilestoneBought } from '@shared/index'
import { Milestones } from '@shared/milestones'
import { styled } from 'styled-components'
import { MilestoneDisplay } from '../../MilestonesModal/components/MilestoneDisplay'
import { PlayerDidHeader } from './PlayerDidHeader'

type Props = {
	event: MilestoneBought
}

export const MilestoneBoughtEvent = ({ event }: Props) => {
	const milestone = Milestones[event.milestone]

	return (
		<>
			<PlayerDidHeader playerId={event.playerId} thing={' bought milestone'} />
			<Container>
				<MilestoneDisplay
					milestone={milestone}
					canAfford={false}
					onBuy={() => {}}
					playing={false}
					currentPlayerId={event.playerId}
					ownerId={event.playerId}
				/>
			</Container>
		</>
	)
}

const Container = styled.div`
	margin: 3rem 0;
	min-width: 15rem;
`
