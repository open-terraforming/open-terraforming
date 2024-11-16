import { ClippedBox } from '@/components/ClippedBox'
import { GlobalEvent } from '@shared/expansions/turmoil/globalEvent'
import { Symbols } from '../../CardView/components/Symbols'
import { styled } from 'styled-components'
import { useLocale } from '@/context/LocaleContext'
import { Flex } from '@/components/Flex/Flex'
import { CommitteePartyIcon } from '@/components/CommitteePartyIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

type Props = {
	globalEvent: GlobalEvent
}

export const GlobalEventView = ({ globalEvent }: Props) => {
	const t = useLocale()

	return (
		<Container>
			<Title>{t.globalEvents[globalEvent.code]}</Title>
			<Inner>
				<Delegates>
					<CommitteePartyIcon party={globalEvent.initialDelegate} />
					<Arrow>
						<FontAwesomeIcon icon={faChevronRight} />
						<FontAwesomeIcon icon={faChevronRight} />
						<FontAwesomeIcon icon={faChevronRight} />
					</Arrow>
					<CommitteePartyIcon party={globalEvent.effectDelegate} />
				</Delegates>
				<Effects>
					{globalEvent.effects.map((effect, index) => (
						<div key={index}>
							<Symbols symbols={effect.symbols} />
							<Description>{effect.description}</Description>
						</div>
					))}
				</Effects>
			</Inner>
		</Container>
	)
}

const Container = styled(ClippedBox)`
	width: 200px;
	flex: 1;

	.inner {
		height: 100%;
	}
`

const Inner = styled.div`
	text-align: center;
`

const Title = styled.div`
	background-color: ${({ theme }) => theme.colors.border};
	padding: 0.5rem;
	text-transform: uppercase;
`

const Description = styled.div`
	font-size: 90%;
	margin-top: 0.25rem;
`

const Delegates = styled(Flex)`
	padding: 0.5rem;
	justify-content: space-between;
`

const Arrow = styled.div`
	font-size: 150%;
	color: ${({ theme }) => theme.colors.border};
`

const Effects = styled.div`
	border-top: 2px solid ${({ theme }) => theme.colors.border};
	padding: 0.5rem;
`
