import { Flex } from '@/components/Flex/Flex'
import { Modal } from '@/components/Modal/Modal'
import { useGameState } from '@/utils/hooks'
import { getRulingParty } from '@shared/expansions/turmoil/utils/getRulingParty'
import { styled } from 'styled-components'
import { Symbols } from '../CardView/components/Symbols'
import { CommitteePartiesView } from './components/CommitteePartiesView'
import { DelegatesBox } from './components/DelegatesBox'
import { RulingPartyDisplay } from './components/RulingPartyDisplay'
import { Button } from '@/components'
import { useState } from 'react'
import { useApi } from '@/context/ApiContext'
import { addDelegateToPartyActionRequest } from '@shared/actions'

type Props = {
	onClose: () => void
}

export const CommitteeModal = ({ onClose }: Props) => {
	const game = useGameState()
	const api = useApi()
	const rulingParty = getRulingParty(game)
	const [isPlacing, setIsPlacing] = useState(false)

	const handlePartyClick = (party: string) => {
		if (!isPlacing) {
			return
		}

		api.send(addDelegateToPartyActionRequest(party))

		setIsPlacing(false)
	}

	return (
		<Modal open onClose={onClose} header="Committee">
			<Flex gap="0.25rem" align="stretch">
				<Flex
					style={{ flex: 1 }}
					direction="column"
					gap="0.25rem"
					align="stretch"
				>
					<DelegatesBox
						title={'Neutral reserve'}
						delegates={game.committee.reserve.filter((r) => !r)}
					/>
					<DelegatesBox
						title={
							<Flex>
								<div>Lobby</div>
								<ActionButton onClick={() => setIsPlacing(true)}>
									To party
								</ActionButton>
							</Flex>
						}
						delegates={game.committee.lobby}
					/>
				</Flex>
				{rulingParty && <RulingPartyDisplay party={rulingParty} />}
				<DelegatesBox
					title={
						<Flex>
							<div>Reserve</div>
							<ActionButton onClick={() => setIsPlacing(true)}>
								<Symbols symbols={[{ resource: 'money', count: 5 }]} /> To party
							</ActionButton>
						</Flex>
					}
					delegates={game.committee.reserve.filter((r) => !!r)}
				/>
			</Flex>

			<CommitteePartiesView
				placingMode={isPlacing}
				onClick={handlePartyClick}
			/>
		</Modal>
	)
}

export const StyledSymbols = styled(Symbols)`
	justify-content: flex-start;
`

export const ActionButton = styled(Button)`
	margin: 0;
	padding: 0.1rem 0.25rem;
	margin-left: auto;
`
