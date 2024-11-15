import { Modal } from '@/components/Modal/Modal'
import { useLocale } from '@/context/LocaleContext'
import { useAppStore, useGameState } from '@/utils/hooks'
import { getCommitteeParty } from '@shared/utils'
import { Symbols } from '../CardView/components/Symbols'
import { getRulingParty } from '@shared/expansions/turmoil/utils/getRulingParty'
import { styled } from 'styled-components'

type Props = {
	onClose: () => void
}

export const CommitteeModal = ({ onClose }: Props) => {
	const game = useGameState()
	// const player = usePlayerState()
	const playerMap = useAppStore((store) => store.game.playerMap)
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
					<div key={party.code} style={{ width: '40%', margin: '1rem' }}>
						<div>{t.committeeParties[party.code]}</div>
						<div>
							Possible Ruling Bonus:{' '}
							<div>
								<StyledSymbols
									symbols={getCommitteeParty(party.code).bonus.symbols}
								/>
								{getCommitteeParty(party.code).bonus.description}
							</div>
						</div>
						<div>
							Possible Ruling Policy:{' '}
							{getCommitteeParty(party.code).policy.active.map(
								(policy, index) => (
									<div key={index}>
										<StyledSymbols symbols={policy.symbols} />
										{policy.description}
									</div>
								),
							)}
							{getCommitteeParty(party.code).policy.passive.map(
								(policy, index) => (
									<div key={index}>
										<StyledSymbols symbols={policy.symbols} />
										{policy.description}
									</div>
								),
							)}
						</div>
						<div>
							Party leader:{' '}
							{party.leader
								? party.leader.playerId?.id
									? playerMap[party.leader.playerId.id].name
									: 'Neutral'
								: 'No leader'}
						</div>
						<div>Members:</div>
						<div>
							{party.members.length === 0 && 'No members'}
							{party.members.map((member, index) => (
								<div key={index}>
									{member.playerId?.id
										? playerMap[member.playerId.id].name
										: 'Neutral'}
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</Modal>
	)
}

const StyledSymbols = styled(Symbols)`
	justify-content: flex-start;
`
