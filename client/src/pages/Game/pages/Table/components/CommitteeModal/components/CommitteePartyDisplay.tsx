import { CommitteePartyIcon } from '@/components/CommitteePartyIcon'
import { useLocale } from '@/context/LocaleContext'
import { useAppStore } from '@/utils/hooks'
import { CommitteePartyState } from '@shared/gameState'
import { getCommitteeParty } from '@shared/utils'
import styled from 'styled-components'
import { Symbols } from '../../CardView/components/Symbols'
import { ClippedBox } from '@/components/ClippedBox'
import { ClippedBoxTitle } from '@/components/ClippedBoxTitle'

type Props = {
	state: CommitteePartyState
}

export const CommitteePartyDisplay = ({ state }: Props) => {
	const party = getCommitteeParty(state.code)
	const t = useLocale()
	const playerMap = useAppStore((store) => store.game.playerMap)

	return (
		<ClippedBox style={{ width: '20rem', margin: 'auto' }}>
			<ClippedBoxTitle>
				<CommitteePartyIcon party={party.code} />{' '}
				{t.committeeParties[party.code]}
			</ClippedBoxTitle>
			<div>
				Party leader:{' '}
				{state.leader
					? state.leader.playerId?.id
						? playerMap[state.leader.playerId.id].name
						: 'Neutral'
					: 'No leader'}
			</div>
			<div>Members:</div>
			<div>
				{state.members.length === 0 && 'No members'}
				{state.members.map((member, index) => (
					<div key={index}>
						{member.playerId?.id
							? playerMap[member.playerId.id].name
							: 'Neutral'}
					</div>
				))}
			</div>
			<div>
				Possible Ruling Bonus:{' '}
				<div>
					<StyledSymbols symbols={party.bonus.symbols} />
					{party.bonus.description}
				</div>
			</div>
			<div>
				Possible Ruling Policy:{' '}
				{party.policy.active.map((policy, index) => (
					<div key={index}>
						<StyledSymbols symbols={policy.symbols} />
						{policy.description}
					</div>
				))}
				{party.policy.passive.map((policy, index) => (
					<div key={index}>
						<StyledSymbols symbols={policy.symbols} />
						{policy.description}
					</div>
				))}
			</div>
		</ClippedBox>
	)
}

const StyledSymbols = styled(Symbols)`
	justify-content: flex-start;
`
