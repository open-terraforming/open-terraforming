import { CommitteePartyIcon } from '@/components/CommitteePartyIcon'
import { Flex } from '@/components/Flex/Flex'
import { useLocale } from '@/context/LocaleContext'
import { CommitteeDominantPartyChanged } from '@shared/index'
import { styled } from 'styled-components'

type Props = {
	event: CommitteeDominantPartyChanged
}

export const CommitteeDominantPartyChangedEvent = ({ event }: Props) => {
	const locale = useLocale()

	return (
		<Container>
			<CommitteePartyIcon party={event.partyCode} />{' '}
			{locale.committeeParties[event.partyCode]} party is now dominant party
		</Container>
	)
}

const Container = styled(Flex)`
	text-align: center;
	margin: 1rem 3rem;
	gap: 0.5rem;
`
