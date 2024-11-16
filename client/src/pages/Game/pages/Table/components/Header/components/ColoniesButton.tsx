import { Tooltip } from '@/components'
import { Flex } from '@/components/Flex/Flex'
import { Position } from '@/components/Tooltip/Tooltip'
import { useGameState, usePlayerState } from '@/utils/hooks'
import { getColoniesCount } from '@shared/expansions/colonies/utils/getColoniesCount'
import { getPlayerColoniesCount } from '@shared/expansions/colonies/utils/getPlayerColoniesCount'
import { getPlayerUsedFleets } from '@shared/expansions/colonies/utils/getPlayerUsedFleets'
import { forwardRef } from 'react'
import styled from 'styled-components'
import { ColoniesModal } from '../../ColoniesModal/ColoniesModal'
import { HeaderDialogButton } from './HeaderDialogButton'

export const ColoniesButton = forwardRef<HTMLDivElement>((_, ref) => {
	const game = useGameState()
	const player = usePlayerState()

	return (
		<Container ref={ref}>
			<HeaderDialogButton
				dialog={(close) => <ColoniesModal onClose={close} />}
				noClip
			>
				Colonies
			</HeaderDialogButton>
			<SubContainer>
				<Tooltip
					position={Position.Bottom}
					content={
						<>
							<div>The total number of colonies built</div>
							<div>
								Your colonies: {getPlayerColoniesCount({ game, player })}
							</div>
						</>
					}
				>
					<SubTitle>Built</SubTitle>
				</Tooltip>
				<SubValue>{getColoniesCount({ game })}</SubValue>
				<Separator />
				<SubValue>
					{player.tradeFleets - getPlayerUsedFleets(game, player).length}
				</SubValue>
				<Tooltip
					position={Position.Bottom}
					content={
						<>
							<div>Number of fleets currently available to you</div>
							<div>Your total fleets: {player.tradeFleets}</div>
						</>
					}
				>
					<SubTitle>Fleets</SubTitle>
				</Tooltip>
			</SubContainer>
		</Container>
	)
})

const Container = styled.div`
	margin-top: 0.5rem;
`

const SubContainer = styled(Flex)`
	// Not sure why this is required, but it is
	margin-top: -1px;
	align-items: stretch;
	border-bottom: 2px solid ${({ theme }) => theme.colors.border};
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
	height: 100%;
	box-sizing: border-box;
`

const SubValue = styled.div`
	padding: 0.3rem 0.5rem;
	background: ${({ theme }) => theme.colors.background};
`

const Separator = styled.div`
	width: 2px;
	background-color: ${({ theme }) => theme.colors.border};
`
