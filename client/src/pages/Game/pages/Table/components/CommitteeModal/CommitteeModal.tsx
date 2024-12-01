import { Flex } from '@/components/Flex/Flex'
import { Modal } from '@/components/Modal/Modal'
import { useGameState } from '@/utils/hooks'
import { SymbolType } from '@shared/cards'
import { getPartyState } from '@shared/expansions/turmoil/utils/getPartyState'
import { getRulingParty } from '@shared/expansions/turmoil/utils/getRulingParty'
import { useState } from 'react'
import { styled } from 'styled-components'
import { Symbols } from '../CardView/components/Symbols'
import { CommitteePartiesView } from './components/CommitteePartiesView'
import { CommitteePartyDisplay } from './components/CommitteePartyDisplay'
import { DelegatesBox } from './components/DelegatesBox'
import { RulingPartyDisplay } from './components/RulingPartyDisplay'
import { Tooltip } from '@/components'
import { useLocale } from '@/context/LocaleContext'

type Props = {
	onClose: () => void
}

export const CommitteeModal = ({ onClose }: Props) => {
	const t = useLocale()
	const game = useGameState()
	const rulingParty = getRulingParty(game)

	const [selectedPartyCode, setSelectedPartyCode] = useState<string | null>(
		null,
	)

	const selectedParty =
		selectedPartyCode && getPartyState(game, selectedPartyCode)

	const handlePartyClick = (party: string) => {
		setSelectedPartyCode(selectedPartyCode === party ? null : party)
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
						title={<Tooltip content={t.help.committeeLobby}>Lobby</Tooltip>}
						delegates={game.committee.lobby}
					/>
				</Flex>
				{rulingParty && <RulingPartyDisplay party={rulingParty} />}
				<DelegatesBox
					title={
						<Flex>
							<div>
								<Tooltip content={t.help.committeeReserve}>Reserve</Tooltip>
							</div>
							<TitleInfo>
								<Symbols
									noSpacing
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
				onClick={handlePartyClick}
				selectedCode={selectedPartyCode ?? undefined}
			/>

			{selectedParty && <CommitteePartyDisplay state={selectedParty} />}
		</Modal>
	)
}

export const StyledSymbols = styled(Symbols)`
	justify-content: flex-start;
`

export const TitleInfo = styled.div`
	margin-left: auto;
`
