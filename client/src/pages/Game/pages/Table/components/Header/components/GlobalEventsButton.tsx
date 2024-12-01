import { Tooltip } from '@/components'
import { Flex } from '@/components/Flex/Flex'
import { useLocale } from '@/context/LocaleContext'
import { useGameState } from '@/utils/hooks'
import { getGlobalEvent } from '@shared/utils'
import { styled } from 'styled-components'
import { Symbols } from '../../CardView/components/Symbols'
import { GlobalEventsModal } from '../../GlobalEventsModal/GlobalEventsModal'
import { HeaderDialogButton } from './HeaderDialogButton'

export const GlobalEventsButton = () => {
	const game = useGameState()

	const currentEvent =
		game.globalEvents.currentEvent &&
		getGlobalEvent(game.globalEvents.currentEvent)

	const t = useLocale()

	return (
		<Container>
			<HeaderDialogButton
				dialog={(close) => <GlobalEventsModal onClose={close} />}
				noClip
			>
				Global Events
			</HeaderDialogButton>
			<SubContainer>
				{!currentEvent && <None>NONE</None>}

				{currentEvent && (
					<Tooltip
						title={`Current global event: ${t.globalEvents[currentEvent.code]}`}
						content={currentEvent.effects.map((e) => e.description).join(' ')}
						position={'bottom-center'}
					>
						<Flex justify="center">
							{currentEvent.effects.map((effect, index) => (
								<StyledSymbols
									key={index}
									symbols={effect.symbols}
									noVerticalSpacing
								/>
							))}
						</Flex>
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

const StyledSymbols = styled(Symbols)`
	padding: 0.2rem 0;
`
