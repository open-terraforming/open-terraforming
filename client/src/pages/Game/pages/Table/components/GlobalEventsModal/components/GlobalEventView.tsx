import { ClippedBox } from '@/components/ClippedBox'
import { GlobalEvent } from '@shared/expansions/turmoil/globalEvent'
import { Symbols } from '../../CardView/components/Symbols'
import { css, styled } from 'styled-components'
import { useLocale } from '@/context/LocaleContext'
import { Flex } from '@/components/Flex/Flex'
import { CommitteePartyIcon } from '@/components/CommitteePartyIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { Tooltip } from '@/components'

type Props = {
	globalEvent: GlobalEvent
	highlightEffect?: boolean
	highlightDistantDelegate?: boolean
	highlightCurrentDelegate?: boolean
}

export const GlobalEventView = ({
	globalEvent,
	highlightEffect,
	highlightCurrentDelegate,
	highlightDistantDelegate,
}: Props) => {
	const t = useLocale()

	const allSymbols = globalEvent.effects.flatMap((effect) => effect.symbols)

	const allDescriptions = globalEvent.effects.map(
		(effect) => effect.description,
	)

	return (
		<Container>
			<Title>{t.globalEvents[globalEvent.code]}</Title>
			<Inner>
				<Delegates $faded={!!highlightEffect}>
					<Tooltip
						content={
							'Neutral delegate added to this party when this global become DISTANT'
						}
					>
						<StyledParty
							party={globalEvent.initialDelegate}
							$faded={highlightCurrentDelegate}
						/>
					</Tooltip>
					<Arrow>
						<FontAwesomeIcon icon={faChevronRight} />
						<FontAwesomeIcon icon={faChevronRight} />
						<FontAwesomeIcon icon={faChevronRight} />
					</Arrow>
					<Tooltip
						content={
							'Neutral delegate added to this party when this global event becomes CURRENT'
						}
					>
						<StyledParty
							party={globalEvent.effectDelegate}
							$faded={highlightDistantDelegate}
						/>
					</Tooltip>
				</Delegates>
				<Effects>
					<Symbols symbols={allSymbols} />
					<Description>{allDescriptions.join(' ')}</Description>
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
	text-align: center;
`

const Description = styled.div`
	font-size: 90%;
	margin-top: 0.25rem;
`

const Delegates = styled(Flex)<{ $faded: boolean }>`
	padding: 0.5rem;
	justify-content: space-between;

	${({ $faded }) =>
		$faded &&
		css`
			opacity: 0.2;
		`}
`

const Arrow = styled.div`
	font-size: 150%;
	color: ${({ theme }) => theme.colors.border};
`

const Effects = styled.div`
	border-top: 2px solid ${({ theme }) => theme.colors.border};
	padding: 0.5rem;
`

const StyledParty = styled(CommitteePartyIcon)<{ $faded?: boolean }>`
	${({ $faded }) =>
		$faded &&
		css`
			opacity: 0.2;
		`}
`
