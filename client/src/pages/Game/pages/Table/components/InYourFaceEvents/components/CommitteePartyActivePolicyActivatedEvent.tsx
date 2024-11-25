import { ClippedBox } from '@/components/ClippedBox'
import { ClippedBoxTitle } from '@/components/ClippedBoxTitle'
import { CommitteePartyIcon } from '@/components/CommitteePartyIcon'
import { Flex } from '@/components/Flex/Flex'
import { usePlayerState } from '@/utils/hooks'
import { CommitteePartyActivePolicyActivated } from '@shared/index'
import { getCommitteeParty } from '@shared/utils'
import { styled } from 'styled-components'
import { Symbols } from '../../CardView/components/Symbols'
import { PlayerDidHeader } from './PlayerDidHeader'
import { SymbolsEventLog } from './SymbolsEventLog'

type Props = {
	event: CommitteePartyActivePolicyActivated
}

export const CommitteePartyActivePolicyActivatedEvent = ({ event }: Props) => {
	const playerId = usePlayerState().id
	const party = getCommitteeParty(event.partyCode)

	return (
		<Container>
			<PlayerDidHeader
				playerId={event.playerId}
				thing={' used ruling policy'}
			/>

			<ClippedBox style={{ width: '20rem' }}>
				<ClippedBoxTitle>
					<Flex gap="0.25rem" justify="center">
						<CommitteePartyIcon party={party.code} />
						Ruling Policy
					</Flex>
				</ClippedBoxTitle>
				{party.policy.active.map((policy, index) => (
					<PolicyEffect key={index}>
						<Symbols symbols={policy.symbols} noVerticalSpacing />
						<EffectDescription>{policy.description}</EffectDescription>
					</PolicyEffect>
				))}
			</ClippedBox>

			<SymbolsEventLog events={event.changes} currentPlayerId={playerId} />
		</Container>
	)
}

const Container = styled.div`
	text-align: center;
	margin: 1rem 3rem;
`

const PolicyEffect = styled.div`
	padding: 1rem 0.5rem;
`

const EffectDescription = styled.div`
	margin-top: 0.5rem;
`
