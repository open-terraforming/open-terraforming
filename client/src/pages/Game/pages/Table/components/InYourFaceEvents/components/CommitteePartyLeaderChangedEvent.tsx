import { CommitteePartyIcon } from '@/components/CommitteePartyIcon'
import { useLocale } from '@/context/LocaleContext'
import { useAppStore } from '@/utils/hooks'
import { CommitteePartyLeaderChanged } from '@shared/index'
import { styled } from 'styled-components'

type Props = {
	event: CommitteePartyLeaderChanged
}

export const CommitteePartyLeaderChangedEvent = ({ event }: Props) => {
	const locale = useLocale()
	const playerMap = useAppStore((store) => store.game.playerMap)

	const newLeader =
		event.playerId === null
			? { name: 'Neutral', color: '#fff' }
			: playerMap[event.playerId.id]

	return (
		<Container>
			<CommitteePartyIcon party={event.partyCode} />{' '}
			{locale.committeeParties[event.partyCode]} party leader is now{' '}
			<span style={{ color: newLeader.color }}>{newLeader.name}</span>
		</Container>
	)
}

const Container = styled.div`
	text-align: center;
	margin: 1rem 3rem;
`
