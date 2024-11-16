import { Modal } from '@/components/Modal/Modal'
import { useLocale } from '@/context/LocaleContext'
import { useGameState } from '@/utils/hooks'
import { getRulingParty } from '@shared/expansions/turmoil/utils/getRulingParty'
import { styled } from 'styled-components'
import { Symbols } from '../CardView/components/Symbols'
import { CommitteePartyDisplay } from './components/CommitteePartyDisplay'

type Props = {
	onClose: () => void
}

export const CommitteeModal = ({ onClose }: Props) => {
	const game = useGameState()
	const t = useLocale()
	const rulingParty = getRulingParty(game)

	return (
		<Modal open onClose={onClose} header="Committee">
			{rulingParty && (
				<div style={{ width: '50%' }}>
					<div>Ruling party: {t.committeeParties[rulingParty.code]}</div>
					<div>
						Ruling Policy:{' '}
						{rulingParty.policy.active.map((policy, index) => (
							<div key={index}>
								<StyledSymbols symbols={policy.symbols} />
								{policy.description}
							</div>
						))}
						{rulingParty.policy.passive.map((policy, index) => (
							<div key={index}>
								<StyledSymbols symbols={policy.symbols} />
								{policy.description}
							</div>
						))}
					</div>
				</div>
			)}

			<div style={{ display: 'flex', flexWrap: 'wrap' }}>
				{game.committee.parties.map((party) => (
					<CommitteePartyDisplay key={party.code} state={party} />
				))}
			</div>
		</Modal>
	)
}

const StyledSymbols = styled(Symbols)`
	justify-content: flex-start;
`
