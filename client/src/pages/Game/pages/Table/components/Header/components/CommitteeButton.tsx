import { Tooltip } from '@/components'
import { CommitteePartyIcon } from '@/components/CommitteePartyIcon'
import { Flex } from '@/components/Flex/Flex'
import { useLocale } from '@/context/LocaleContext'
import { useGameState } from '@/utils/hooks'
import { getCommitteeParty } from '@shared/utils'
import { styled } from 'styled-components'
import { Symbols } from '../../CardView/components/Symbols'
import { CommitteeModal } from '../../CommitteeModal/CommitteeModal'
import { HeaderDialogButton } from './HeaderDialogButton'

export const CommitteeButton = () => {
	const game = useGameState()

	const rulingParty =
		game.committee.rulingParty && getCommitteeParty(game.committee.rulingParty)

	const t = useLocale()

	return (
		<Container>
			<StyledButton
				dialog={(close) => <CommitteeModal onClose={close} />}
				noClip
			>
				Committee
			</StyledButton>
			<SubContainer>
				{!rulingParty && <None>NONE</None>}

				{rulingParty && (
					<Tooltip
						title={`Current ruling party: ${t.committeeParties[rulingParty.code]}`}
						content={
							<>
								{rulingParty.policy.active.map((e) => e.description).join(' ')}
								{rulingParty.policy.passive.map((e) => e.description).join(' ')}
							</>
						}
						position={'bottom-center'}
					>
						<Data>
							<CommitteePartyIcon party={rulingParty.code} size="sm" />

							{[
								...rulingParty.policy.active.map((p) => p.symbols),
								...rulingParty.policy.passive.map((p) => p.symbols),
							].map((symbols, index) => (
								<Symbols key={index} symbols={symbols} noVerticalSpacing />
							))}
						</Data>
					</Tooltip>
				)}
			</SubContainer>
		</Container>
	)
}

const Data = styled(Flex)`
	justify-content: space-between;
	padding: 0 0.5rem;
`

const Container = styled.div`
	margin-top: 0.5rem;
	width: 10rem;
`

const StyledButton = styled(HeaderDialogButton)`
	/*padding: 0.15rem 0.1rem;*/
`

const SubContainer = styled.div`
	// Not sure why this is required, but it is
	margin-top: -1px;
	border: 2px solid ${({ theme }) => theme.colors.border};
	border-top: none;
	background-color: ${({ theme }) => theme.colors.border};
`

const None = styled.div`
	text-align: center;
	padding: 0.25rem;
`
