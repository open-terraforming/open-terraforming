import { CommitteePartyIcon } from '@/components/CommitteePartyIcon'
import { useLocale } from '@/context/LocaleContext'
import { useAppStore, useGameState } from '@/utils/hooks'
import { CommitteePartyState } from '@shared/gameState'
import { getCommitteeParty } from '@shared/utils'
import styled from 'styled-components'
import { Symbols } from '../../CardView/components/Symbols'
import { ClippedBox } from '@/components/ClippedBox'
import { ClippedBoxTitle } from '@/components/ClippedBoxTitle'
import { Flex } from '@/components/Flex/Flex'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { DelegatesView } from './DelegatesView'
import { DelegateIcon } from '@/components/DelegateIcon'
import { Tooltip } from '@/components'

type Props = {
	state: CommitteePartyState
}

export const CommitteePartyDisplay = ({ state }: Props) => {
	const game = useGameState()
	const party = getCommitteeParty(state.code)
	const t = useLocale()
	const playerMap = useAppStore((store) => store.game.playerMap)

	return (
		<ClippedBox style={{ width: '20rem', margin: 'auto' }}>
			<ClippedBoxTitle>
				<Flex>
					<Flex gap="0.25rem">
						<CommitteePartyIcon party={party.code} />{' '}
						{t.committeeParties[party.code]}
					</Flex>
					{game.committee.dominantParty === state.code && (
						<Dominant>
							<DominantIcon>
								<FontAwesomeIcon icon={faStar} />
							</DominantIcon>
							Dominant party
						</Dominant>
					)}
				</Flex>
			</ClippedBoxTitle>

			{!state.leader && state.members.length === 0 && <None>No members</None>}

			{state.leader && (
				<Flex justify="center">
					<Tooltip content="Party leader">
						<Leader>
							<DelegateIcon playerId={state.leader.playerId?.id} />
							{state.leader.playerId
								? playerMap[state.leader.playerId.id].name
								: 'Neutral'}
						</Leader>
					</Tooltip>
				</Flex>
			)}

			{state.members.length > 0 && (
				<Delegates>
					<DelegatesView delegates={state.members.map((m) => m.playerId)} />
				</Delegates>
			)}

			<div>
				<ClippedBoxTitle $centered $spacing>
					Ruling Bonus
				</ClippedBoxTitle>
				<EffectsContainer>
					<StyledSymbols symbols={party.bonus.symbols} noVerticalSpacing />
					{party.bonus.description}
				</EffectsContainer>
			</div>

			<div>
				<ClippedBoxTitle $centered $spacing>
					Ruling Policy
				</ClippedBoxTitle>
				<EffectsContainer>
					{party.policy.active.map((policy, index) => (
						<EffectsContainer key={index}>
							<StyledSymbols symbols={policy.symbols} noVerticalSpacing />
							{policy.description}
						</EffectsContainer>
					))}
					{party.policy.passive.map((policy, index) => (
						<EffectsContainer key={index}>
							<StyledSymbols symbols={policy.symbols} noVerticalSpacing />
							{policy.description}
						</EffectsContainer>
					))}
				</EffectsContainer>
			</div>
		</ClippedBox>
	)
}

const StyledSymbols = styled(Symbols)`
	justify-content: flex-start;
`

const Dominant = styled(Flex)`
	margin-left: auto;
`

const DominantIcon = styled.div`
	color: #d9ff30;
	margin-right: 0.25rem;
`

const EffectsContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 0.5rem;
	text-align: center;
	gap: 0.25rem;
`

const Delegates = styled(Flex)`
	padding: 0.5rem;
	gap: 0.25rem;
	justify-content: center;
	flex-wrap: wrap;
`

const Leader = styled(Flex)`
	gap: 0.25rem;
	padding: 0.5rem;
	border-radius: 0.5rem;
	background-color: ${({ theme }) => theme.colors.border};
	margin: 0.25rem;
`

const None = styled.div`
	padding: 1rem;
	text-align: center;
`
