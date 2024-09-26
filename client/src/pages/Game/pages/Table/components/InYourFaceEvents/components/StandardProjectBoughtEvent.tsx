import { Projects } from '@shared/projects'
import { styled } from 'styled-components'
import { StandardProjectBought } from '@shared/index'
import { PlayerDidHeader } from './PlayerDidHeader'
import { SymbolsEventLog } from './SymbolsEventLog'

type Props = {
	event: StandardProjectBought
}

export const StandardProjectBoughtEvent = ({ event }: Props) => {
	const project = Projects[event.project]

	return (
		<>
			<PlayerDidHeader
				playerId={event.playerId}
				thing={' realized standard project'}
			/>
			<Container>
				<ProjectCentered>{project.description}</ProjectCentered>
				{event.changes && (
					<SymbolsEventLog
						events={event.changes}
						currentPlayerId={event.playerId}
					/>
				)}
			</Container>
		</>
	)
}

const Container = styled.div`
	margin: 3rem 0;
	min-width: 15rem;
`

const ProjectCentered = styled.div`
	font-size: 125%;
	text-align: center;
	text-transform: uppercase;
`
