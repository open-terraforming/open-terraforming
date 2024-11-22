import { Button } from '@/components'
import { Flex } from '@/components/Flex/Flex'
import { Modal } from '@/components/Modal/Modal'
import { useApi } from '@/context/ApiContext'
import { useGameState, usePlayerState, useToggle } from '@/utils/hooks'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { addDelegateToPartyActionRequest } from '@shared/actions'
import { SymbolType } from '@shared/cards'
import { getPartyState } from '@shared/expansions/turmoil/utils/getPartyState'
import { getRulingParty } from '@shared/expansions/turmoil/utils/getRulingParty'
import { PlayerStateValue } from '@shared/gameState'
import { useState } from 'react'
import { styled } from 'styled-components'
import { Symbols } from '../CardView/components/Symbols'
import { CommitteePartiesView } from './components/CommitteePartiesView'
import { CommitteePartyDisplay } from './components/CommitteePartyDisplay'
import { DelegatesBox } from './components/DelegatesBox'
import { RulingPartyDisplay } from './components/RulingPartyDisplay'

type Props = {
	onClose: () => void
}

export const CommitteeModal = ({ onClose }: Props) => {
	const game = useGameState()
	const player = usePlayerState()
	const api = useApi()
	const rulingParty = getRulingParty(game)
	const [isPlacing, toggleIsPlacing, setIsPlacing] = useToggle(false)

	const [selectedPartyCode, setSelectedPartyCode] = useState<string | null>(
		null,
	)

	const selectedParty =
		selectedPartyCode && getPartyState(game, selectedPartyCode)

	const isPlaying = player.state === PlayerStateValue.Playing

	const canPlaceFromLobby =
		isPlaying && game.committee.lobby.some((l) => l.id === player.id)

	const canPlaceFromReserve =
		isPlaying && game.committee.reserve.some((r) => r?.id === player.id)

	const handlePartyClick = (party: string) => {
		if (!isPlacing) {
			setSelectedPartyCode(party)

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
					<DelegatesBox title={'Lobby'} delegates={game.committee.lobby} />
				</Flex>
				{rulingParty && <RulingPartyDisplay party={rulingParty} />}
				<DelegatesBox
					title={
						<Flex>
							<div>Reserve</div>
							<TitleInfo>
								<Symbols
									symbols={[
										{ resource: 'money', count: 5 },
										{ symbol: SymbolType.RightArrow },
									]}
								/>
							</TitleInfo>
						</Flex>
					}
					delegates={game.committee.reserve.filter((r) => !!r)}
				/>
			</Flex>

			<CommitteePartiesView
				placingMode={isPlacing}
				onClick={handlePartyClick}
			/>

			{selectedParty && <CommitteePartyDisplay state={selectedParty} />}

			<Actions>
				{!isPlacing && (
					<>
						{canPlaceFromLobby && (
							<Button onClick={toggleIsPlacing}>
								Place candidate from lobby
							</Button>
						)}
						{!canPlaceFromLobby && canPlaceFromReserve && (
							<Button onClick={toggleIsPlacing}>
								<Symbols
									symbols={[{ resource: 'money', count: 5 }]}
									noSpacing
								/>{' '}
								Place candidate from reserve
							</Button>
						)}
					</>
				)}
				{isPlacing && (
					<Button icon={faTimes} onClick={toggleIsPlacing}>
						Cancel
					</Button>
				)}
			</Actions>
		</Modal>
	)
}

export const StyledSymbols = styled(Symbols)`
	justify-content: flex-start;
`

export const TitleInfo = styled.div`
	margin-left: auto;
`

const Actions = styled(Flex)`
	justify-content: center;
`
