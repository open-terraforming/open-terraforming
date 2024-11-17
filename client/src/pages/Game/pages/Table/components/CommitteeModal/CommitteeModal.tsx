import { Flex } from '@/components/Flex/Flex'
import { Modal } from '@/components/Modal/Modal'
import { useGameState } from '@/utils/hooks'
import { getRulingParty } from '@shared/expansions/turmoil/utils/getRulingParty'
import { styled } from 'styled-components'
import { Symbols } from '../CardView/components/Symbols'
import { CommitteePartiesView } from './components/CommitteePartiesView'
import { DelegatesBox } from './components/DelegatesBox'
import { RulingPartyDisplay } from './components/RulingPartyDisplay'

type Props = {
	onClose: () => void
}

export const CommitteeModal = ({ onClose }: Props) => {
	const game = useGameState()
	const rulingParty = getRulingParty(game)

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
						title="Neutral reserve"
						delegates={game.committee.reserve.filter((r) => !r)}
					/>
					<DelegatesBox title="Lobby" delegates={game.committee.lobby} />
				</Flex>
				{rulingParty && <RulingPartyDisplay party={rulingParty} />}
				<DelegatesBox
					title="Reserve"
					delegates={game.committee.reserve.filter((r) => !!r)}
				/>
			</Flex>

			<CommitteePartiesView />
		</Modal>
	)
}

export const StyledSymbols = styled(Symbols)`
	justify-content: flex-start;
`
