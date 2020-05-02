import { Button } from '@/components'
import { Flex } from '@/components/Flex/Flex'
import { useApi } from '@/context/ApiContext'
import { setTableState } from '@/store/modules/table'
import { colors } from '@/styles'
import { useAppDispatch, useAppStore } from '@/utils/hooks'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { CardsLookupApi } from '@shared/cards'
import { playerPass } from '@shared/index'
import { PlayerActionType } from '@shared/player-actions'
import { darken } from 'polished'
import React from 'react'
import styled, { css } from 'styled-components'
import { CardBuy } from '../CardBuy/CardBuy'
import { GreeneryButton } from './components/GreeneryButton'
import { HandButton } from './components/HandButton/HandButton'
import { HeatButton } from './components/HeatButton'
import { PendingDisplay } from './components/PendingDisplay'
import { Resources } from './components/Resources/Resources'
import { TableButtons } from './components/TableButtons/TableButtons'

export const Controls = () => {
	const api = useApi()
	const dispatch = useAppDispatch()
	const player = useAppStore(state => state.game.player)
	const game = useAppStore(state => state.game.state)
	const isPlaying = useAppStore(state => state.game.playing)
	const pendingAction = useAppStore(state => state.game.pendingAction)

	const buyingCardIndex = useAppStore(state => state.table.buyingCardIndex)
	const playingCardIndex = useAppStore(state => state.table.playingCardIndex)
	const state = player

	const corporation = state?.corporation
		? CardsLookupApi.get(state?.corporation as string)
		: undefined

	const pending = pendingAction

	const handlePass = () => {
		api.send(playerPass(false))
	}

	return (
		<Flex justify="center">
			<Container faded={!!pending}>
				{pending?.type === PlayerActionType.PlayCard && (
					<CardBuy
						buying={false}
						key={pending.cardIndex}
						index={pending.cardIndex}
						onClose={() => false}
					/>
				)}

				{playingCardIndex !== undefined && (
					<CardBuy
						buying={false}
						index={playingCardIndex}
						onClose={() =>
							dispatch(
								setTableState({
									playingCardIndex: undefined
								})
							)
						}
					/>
				)}

				{buyingCardIndex !== undefined && (
					<CardBuy
						buying={true}
						index={buyingCardIndex}
						onClose={() =>
							dispatch(
								setTableState({
									buyingCardIndex: undefined
								})
							)
						}
					/>
				)}

				<Flexed>
					<Resources state={state} />
				</Flexed>
				<HandButton playing={isPlaying} />
				{/*<div>{corporation?.name}</div>*/}
				<Flexed>
					<TableButtons />

					<CardButtons>
						<HeatButton />
						<GreeneryButton />
					</CardButtons>

					<PassButton
						disabled={!isPlaying}
						onClick={handlePass}
						icon={faArrowRight}
					>
						Pass
					</PassButton>
				</Flexed>
				{pending && <PendingDisplay pending={pending} />}
			</Container>
		</Flex>
	)
}

const Container = styled.div<{ faded: boolean }>`
	position: relative;
	display: flex;
	justify-content: center;
	background-color: ${colors.background};
	border-top: 0.2rem solid ${colors.border};
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
	background-size: 40px 40px;
	z-index: 4;

	${props =>
		props.faded &&
		css`
			opacity: 0.7;
		`}
`

const Flexed = styled.div`
	display: flex;
	width: 35rem;
`

const CardButtons = styled.div`
	display: flex;
	flex-direction: column;
	align-content: center;
	justify-content: space-around;
	margin: 0 1rem;
`

const PassButton = styled(Button)`
	margin-left: auto;
`
