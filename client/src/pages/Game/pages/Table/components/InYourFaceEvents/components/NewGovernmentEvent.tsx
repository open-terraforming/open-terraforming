import { DelegateIcon } from '@/components/DelegateIcon'
import { Flex } from '@/components/Flex/Flex'
import { useGameState, usePlayersMap } from '@/utils/hooks'
import { getPartyState } from '@shared/expansions/turmoil/utils/getPartyState'
import { NewGovernment } from '@shared/index'
import { styled } from 'styled-components'
import { CommitteePartyDisplay } from '../../CommitteeModal/components/CommitteePartyDisplay'
import { SymbolsEventLog } from './SymbolsEventLog'

type Props = {
	event: NewGovernment
}

export const NewGovernmentEvent = ({ event }: Props) => {
	const game = useGameState()
	const playersMap = usePlayersMap()

	return (
		<Container>
			<SubTitle>New chairman</SubTitle>

			<Flex justify="center" gap="0.25rem">
				<DelegateIcon
					playerId={event.newChairman?.id ?? null}
					type="chairman"
				/>
				{event.newChairman !== null
					? playersMap[event.newChairman.id].name
					: 'Neutral'}
			</Flex>

			<SubTitle>New ruling party</SubTitle>

			<CommitteePartyDisplay
				state={getPartyState(game, event.newRulingParty)}
				hideMembers
			/>

			<SymbolsEventLog events={event.changes} />
		</Container>
	)
}

const Container = styled.div`
	text-align: center;
	margin: 1rem 3rem;
`

const SubTitle = styled.div`
	font-size: 1.25rem;
	margin: 1.25rem 0 0.5rem 0;
	text-transform: uppercase;
`
