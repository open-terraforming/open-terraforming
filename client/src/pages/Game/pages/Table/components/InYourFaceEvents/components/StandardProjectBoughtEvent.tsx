import { Projects } from '@shared/projects'
import { styled } from 'styled-components'
import { StandardProjectBought } from '../../EventList/types'
import { PlayerDidHeader } from './PlayerDidHeader'
import { SymbolsEventLog } from './SymbolsEventLog'

type Props = {
	event: StandardProjectBought
}

export const StandardProjectBoughtEvent = ({ event }: Props) => {
	const project = Projects[event.project]

	return (
		<>
			<PlayerDidHeader playerId={event.playerId} thing={'bought'} />
			<ProjectCentered>{project.description}</ProjectCentered>
			{event.changes && (
				<SymbolsEventLog
					events={event.changes}
					currentPlayerId={event.playerId}
				/>
			)}
		</>
	)
}

const ProjectCentered = styled.div`
	font-size: 125%;
`
