import { useGameState, usePlayersMap, usePlayerState } from '@/utils/hooks'
import { getPartyState } from '@shared/expansions/turmoil/utils/getPartyState'
import { NewGovernment } from '@shared/index'
import { styled } from 'styled-components'
import { CommitteePartyDisplay } from '../../CommitteeModal/components/CommitteePartyDisplay'
import { SymbolsEventLog } from './SymbolsEventLog'

type Props = {
	event: NewGovernment
}

export const NewGovernmentEvent = ({ event }: Props) => {
	const playerId = usePlayerState().id
	const game = useGameState()
	const playersMap = usePlayersMap()

	return (
		<Container>
			<h2>New government</h2>

			<div>New chairman</div>

			{event.newChairman !== null
				? playersMap[event.newChairman.id].name
				: 'Neutral'}

			<div>New ruling party</div>

			<CommitteePartyDisplay
				state={getPartyState(game, event.newRulingParty)}
			/>

			<SymbolsEventLog events={event.changes} currentPlayerId={playerId} />
		</Container>
	)
}

const Container = styled.div`
	text-align: center;
	margin: 1rem 3rem;
`
