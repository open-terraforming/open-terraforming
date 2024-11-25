import { CommitteePartyIcon } from '@/components/CommitteePartyIcon'
import { Flex } from '@/components/Flex/Flex'
import { useLocale } from '@/context/LocaleContext'
import { useAppStore } from '@/utils/hooks'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CommitteePartyDelegateChange } from '@shared/index'
import { styled } from 'styled-components'

type Props = {
	event: CommitteePartyDelegateChange
}

export const CommitteePartyDelegateChangeEvent = ({ event }: Props) => {
	const playerMap = useAppStore((store) => store.game.playerMap)
	const locale = useLocale()

	return (
		<>
			<Container>
				<PartyContainer>
					<CommitteePartyIcon party={event.partyCode} />
					{locale.committeeParties[event.partyCode]} delegates changed
				</PartyContainer>
				<Flex gap="0.5rem" wrap="wrap" justify="center">
					{event.changes.map(({ playerId, change }, index) => {
						const player =
							playerId === null
								? {
										name: 'Neutral',
										color: '#ccc',
									}
								: playerMap[playerId.id]

						const changeStr = change > 0 ? `+${change}` : change

						return (
							<Flex
								key={index}
								title={`${player.name}: ${changeStr} delegates`}
								gap="0.25rem"
							>
								{changeStr}{' '}
								<FontAwesomeIcon icon={faUser} color={player.color} />
								{player.name}
							</Flex>
						)
					})}
				</Flex>
			</Container>
		</>
	)
}

const Container = styled.div`
	text-align: center;
	margin: 1rem 3rem;
`

const PartyContainer = styled(Flex)`
	gap: 0.25rem;
	margin-bottom: 0.5rem;
`
