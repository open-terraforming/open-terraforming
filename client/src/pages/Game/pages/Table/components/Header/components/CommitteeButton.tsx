import { Tooltip } from '@/components'
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
			<HeaderDialogButton
				dialog={(close) => <CommitteeModal onClose={close} />}
				noClip
			>
				Committee
			</HeaderDialogButton>
			<SubContainer>
				{!rulingParty && <None>NONE</None>}

				{rulingParty && (
					<Tooltip
						content={
							<>
								<div>{t.committeeParties[rulingParty.code]}</div>
								<div>
									{rulingParty.policy.active
										.map((e) => e.description)
										.join(' ')}
									{rulingParty.policy.passive
										.map((e) => e.description)
										.join(' ')}
								</div>
							</>
						}
					>
						{[
							...rulingParty.policy.active.map((p) => p.symbols),
							...rulingParty.policy.passive.map((p) => p.symbols),
						].map((symbols, index) => (
							<Symbols key={index} symbols={symbols} />
						))}
					</Tooltip>
				)}
			</SubContainer>
		</Container>
	)
}

const Container = styled.div`
	margin-top: 0.5rem;
	width: 10rem;
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
