import { ClippedBox } from '@/components/ClippedBox'
import { CommitteePartyIcon } from '@/components/CommitteePartyIcon'
import { Flex } from '@/components/Flex/Flex'
import { CommitteeParty } from '@shared/expansions/turmoil/committeeParty'
import styled from 'styled-components'
import { Symbols } from '../../CardView/components/Symbols'
import { useLocale } from '@/context/LocaleContext'

export const RulingPartyDisplay = ({ party }: { party: CommitteeParty }) => {
	const t = useLocale()

	return (
		<Container>
			<Title>
				<TitleLabel>Ruling party</TitleLabel>
				<TitleParty>
					{t.committeeParties[party.code]}
					<CommitteePartyIcon party={party.code} />
				</TitleParty>
			</Title>
			<Effect>
				<Flex gap="0.25rem" justify="center">
					{party.policy.active.map((policy, index) => (
						<StyledSymbols key={index} symbols={policy.symbols} />
					))}
					{party.policy.passive.map((policy, index) => (
						<StyledSymbols key={index} symbols={policy.symbols} />
					))}
				</Flex>
				<div style={{ textAlign: 'center' }}>
					{[
						...party.policy.active.map((p) => p.description),
						...party.policy.passive.map((p) => p.description),
					].join(' ')}
				</div>
			</Effect>
		</Container>
	)
}

const Title = styled(Flex)`
	background-color: ${({ theme }) => theme.colors.border};
	text-transform: uppercase;
	padding: 0.1rem 0.5rem;
`

const Effect = styled(Flex)`
	padding: 0.25rem;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	flex: 1;
`

const TitleLabel = styled.div``

const TitleParty = styled(Flex)`
	gap: 0.25rem;
	margin-left: auto;
	padding: 0.1rem;
`

const Container = styled(ClippedBox)`
	height: 125px;
	width: 250px;

	.inner {
		display: flex;
		flex-direction: column;
	}
`

const StyledSymbols = styled(Symbols)`
	justify-content: flex-start;
`
