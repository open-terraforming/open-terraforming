import { Competitions } from '@shared/competitions'
import { CompetitionSponsored } from '@shared/index'
import { styled } from 'styled-components'
import { CompetitionDisplay } from '../../CompetitionsModal/components/CompetitionDisplay'
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
				<CompetitionDisplay
					competition={competition}
					canAfford={false}
					onBuy={() => {}}
					playing={false}
					cost={0}
					sponsoredId={event.playerId}
				/>
			</Container>
		</>
	)
}

const Container = styled.div`
	margin: 3rem 0;
	min-width: 15rem;
`
