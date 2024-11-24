import { CommitteePartyIcon } from '@/components/CommitteePartyIcon'
import { Flex } from '@/components/Flex/Flex'
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

	return (
		<Container>
			<div>
				<CommitteePartyIcon party={event.partyCode} />
			</div>
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
						<Flex key={index} title={`${player.name}: ${changeStr} delegates`}>
							{changeStr} <FontAwesomeIcon icon={faUser} color={player.color} />
						</Flex>
					)
				})}
			</Flex>
		</Container>
	)
}

const Container = styled.div`
	font-size: 125%;
	text-align: center;
	margin: 1rem 3rem;
`
