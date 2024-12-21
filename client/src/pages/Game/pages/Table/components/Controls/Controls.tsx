import { Button } from '@/components'
import { useApi } from '@/context/ApiContext'
import { setTableState } from '@/store/modules/table'
import { useAppDispatch, useAppStore, usePlayerState } from '@/utils/hooks'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { playerPass } from '@shared/index'
import { PlayerActionType } from '@shared/player-actions'
import { darken } from 'polished'
import styled, { css } from 'styled-components'
import { CardBuy } from '../CardBuy/CardBuy'
import { HandButton } from './components/HandButton/HandButton'
import { PendingDisplay } from './components/PendingDisplay'
import { Resources } from './components/Resources/Resources'
import { TableButtons } from './components/TableButtons/TableButtons'
import { FrontendPendingDisplay } from './components/FrontendPendingDisplay'

export const Controls = () => {
	const api = useApi()
	const dispatch = useAppDispatch()
	const player = useAppStore((state) => state.game.player)
	const isPlaying = useAppStore((state) => state.game.playing)
	const pendingAction = useAppStore((state) => state.game.pendingAction)
	const pendingActionIndex = usePlayerState().pendingActions.length

	const frontendPending = useAppStore(
		(state) => state.table.pendingFrontendActions[0],
	)

	const buyingCardIndex = useAppStore((state) => state.table.buyingCardIndex)
	const playingCardIndex = useAppStore((state) => state.table.playingCardIndex)

	const pickingCellForBuyArg = useAppStore(
		(state) => state.table.pickingCellForBuyArg,
	)

	const state = player

	const pending =
		pendingAction?.type !== PlayerActionType.PickCards
			? pendingAction
			: undefined

	const handlePass = () => {
		api.send(playerPass(false))
	}

	return (
		<Container faded={!!pending}>
			{pending?.type === PlayerActionType.PlayCard && (
				<CardBuy
					hidden={!!pickingCellForBuyArg}
					buying={false}
					key={`${pending.cardIndex}_${pendingActionIndex}`}
					index={pending.cardIndex}
					onClose={() => false}
				/>
			)}

			{playingCardIndex !== undefined && (
				<CardBuy
					hidden={!!pickingCellForBuyArg}
					buying={false}
					index={playingCardIndex}
					onClose={() =>
						dispatch(
							setTableState({
								playingCardIndex: undefined,
							}),
						)
					}
				/>
			)}

			{buyingCardIndex !== undefined && (
				<CardBuy
					hidden={!!pickingCellForBuyArg}
					buying={true}
					index={buyingCardIndex}
					onClose={() =>
						dispatch(
							setTableState({
								buyingCardIndex: undefined,
							}),
						)
					}
				/>
			)}

			<Flexed>
				<Resources state={state} />
			</Flexed>
			<HandButton playing={isPlaying} />
			<Flexed>
				<TableButtons />

				<PassButton
					noClip
					disabled={!isPlaying}
					onClick={handlePass}
					icon={faArrowRight}
				>
					Pass
				</PassButton>
			</Flexed>
			{pending && <PendingDisplay pending={pending} />}
			{frontendPending && <FrontendPendingDisplay pending={frontendPending} />}
		</Container>
	)
}

const Container = styled.div<{ faded: boolean }>`
	position: relative;
	display: flex;
	justify-content: center;
	background-color: ${({ theme }) => theme.colors.background};
	border-top: 0.2rem solid ${({ theme }) => theme.colors.border};
	border-right: 0.2rem solid ${({ theme }) => theme.colors.border};
	margin: 0 auto;

	width: 100%;
	max-width: 70rem;

	${({ theme: { colors } }) => css`
		background: linear-gradient(
			45deg,
			${darken(0.01, colors.background)} 25%,
			${colors.background} 25%,
			${colors.background} 50%,
			${darken(0.01, colors.background)} 50%,
			${darken(0.01, colors.background)} 75%,
			${colors.background} 75%,
			${colors.background}
		);
	`}
	background-size: 40px 40px;
	z-index: 4;

	${(props) =>
		props.faded &&
		css`
			opacity: 0.7;
		`}
`

const Flexed = styled.div`
	display: flex;
	flex-basis: 0;
	flex-grow: 1;
	flex-shrink: 1;
`

const PassButton = styled(Button)`
	margin-left: auto;
`
