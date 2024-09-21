import { Milestones } from '@shared/milestones'
import { styled } from 'styled-components'
import { MilestoneBought } from '@shared/index'
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
				<CenteredTitle>{milestone.title}</CenteredTitle>
				<CenteredDescription>{milestone.description}</CenteredDescription>
			</Container>
		</>
	)
}

const Container = styled.div`
	margin: 3rem 0;
	min-width: 15rem;
`

const CenteredTitle = styled.div`
	font-size: 125%;
	text-align: center;
`

const CenteredDescription = styled.div`
	text-align: center;
`
