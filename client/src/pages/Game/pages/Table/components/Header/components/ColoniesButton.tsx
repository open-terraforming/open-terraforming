import { DialogButton } from '@/components/DialogButton/DialogButton'
import { ColoniesModal } from '../../ColoniesModal/ColoniesModal'
import styled from 'styled-components'
import { Flex } from '@/components/Flex/Flex'
import { useGameState, usePlayerState } from '@/utils/hooks'
import { getColoniesCount } from '@shared/expansions/colonies/utils/getColoniesCount'
import { getPlayerUsedFleets } from '@shared/expansions/colonies/utils/getPlayerUsedFleets'

export const ColoniesButton = () => {
	const game = useGameState()
	const player = usePlayerState()

	return (
		<Container>
			<StyledButton
				dialog={(close) => <ColoniesModal onClose={close} />}
				noClip
			>
				Colonies
			</StyledButton>
			<SubContainer>
				<SubTitle>Built</SubTitle>
				<SubValue>{getColoniesCount({ game })}</SubValue>
				<Separator />
				<SubValue>
					{player.tradeFleets - getPlayerUsedFleets(game, player).length}
				</SubValue>
				<SubTitle>Fleets</SubTitle>
			</SubContainer>
		</Container>
	)
}

const Container = styled.div`
	margin-top: 0.5rem;
`

const SubContainer = styled(Flex)`
	// Not sure why this is required, but it is
	margin-top: -1px;
	align-items: stretch;
`

const StyledButton = styled(DialogButton)`
	background-color: ${({ theme }) => theme.colors.background};
	border: 2px solid ${({ theme }) => theme.colors.border};
	padding: 0;
	display: flex;
	padding: 0.5rem 1rem;
	width: 100%;
	box-sizing: border-box;
`

const SubTitle = styled.div`
	background-color: ${({ theme }) => theme.colors.border};
	padding: 0.3rem 0.5rem;
	text-transform: uppercase;
	font-size: 80%;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 2.5rem;
`

const SubValue = styled.div`
	padding: 0.3rem 0.5rem;
	border-bottom: 2px solid ${({ theme }) => theme.colors.border};
	background: ${({ theme }) => theme.colors.background};
`

const Separator = styled.div`
	width: 2px;
	background-color: ${({ theme }) => theme.colors.border};
`
