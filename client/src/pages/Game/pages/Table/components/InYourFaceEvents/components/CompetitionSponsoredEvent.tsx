import { Competitions } from '@shared/competitions'
import { styled } from 'styled-components'
import { CompetitionSponsored } from '@shared/index'
import { PlayerDidHeader } from './PlayerDidHeader'

type Props = {
	event: CompetitionSponsored
}

export const CompetitionSponsoredEvent = ({ event }: Props) => {
	const competition = Competitions[event.competition]

	return (
		<>
			<PlayerDidHeader
				playerId={event.playerId}
				thing={' sponsored competition'}
			/>
			<Container>
				<CenteredTitle>{competition.title}</CenteredTitle>
				<CenteredDescription>{competition.description}</CenteredDescription>
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
