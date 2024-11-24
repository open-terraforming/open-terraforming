import { CommitteePartyIcon } from '@/components/CommitteePartyIcon'
import { CommitteeDominantPartyChanged } from '@shared/index'
import { styled } from 'styled-components'

type Props = {
	event: CommitteeDominantPartyChanged
}

export const CommitteeDominantPartyChangedEvent = ({ event }: Props) => {
	return (
		<Container>
			Dominant party changed to <CommitteePartyIcon party={event.partyCode} />
		</Container>
	)
}

const Container = styled.div`
	font-size: 125%;
	text-align: center;
	margin: 1rem 3rem;
`
