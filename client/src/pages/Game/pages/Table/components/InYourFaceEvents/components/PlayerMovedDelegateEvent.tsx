import { PlayerMovedDelegate } from '@shared/index'
import { styled } from 'styled-components'
import { PlayerDidHeader } from './PlayerDidHeader'
import { SymbolsEventLog } from './SymbolsEventLog'
import { CommitteePartyDisplay } from '../../CommitteeModal/components/CommitteePartyDisplay'
import { useLocale } from '@/context/LocaleContext'

type Props = {
	event: PlayerMovedDelegate
}

export const PlayerMovedDelegateEvent = ({ event }: Props) => {
	const playerId = event.playerId
	const t = useLocale()

	return (
		<Container>
			<PlayerDidHeader
				playerId={event.playerId}
				thing={' added delegate to ' + t.committeeParties[event.partyCode]}
			/>

			<CommitteePartyDisplay state={event.partyState} hideActions />

			<SymbolsEventLog events={event.changes} currentPlayerId={playerId} />
		</Container>
	)
}

const Container = styled.div`
	text-align: center;
	margin: 1rem 3rem;
`
