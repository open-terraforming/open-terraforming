import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { useAppStore, useAppDispatch } from '@/utils/hooks'
import { Resources } from './components/Resources'
import { Button } from '@/components'
import { Corporations } from '@shared/corporations'
import { playerPass, PlayerStateValue } from '@shared/index'
import { faArrowRight, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { Hand } from '../Hand/Hand'
import { PlayedCards } from '../PlayedCards/PlayedCards'
import { setTableState } from '@/store/modules/table'
import { CardBuy } from '../CardBuy/CardBuy'
import { useApi } from '@/context/ApiContext'

export const Controls = () => {
	const api = useApi()
	const dispatch = useAppDispatch()
	const player = useAppStore(state => state.game.player)
	const buyingCardIndex = useAppStore(state => state.table.buyingCardIndex)
	const playingCardIndex = useAppStore(state => state.table.playingCardIndex)
	const state = player?.gameState
	const corporation = Corporations.find(c => c.code === state?.corporation)
	const [handOpened, setHandOpened] = useState(false)
	const [cardsOpened, setCardsOpened] = useState(false)
	const stackedActions = player?.gameState.cardsToPlay

	const isPlaying = state?.state === PlayerStateValue.Playing

	const faded = state?.placingTile.length !== 0

	const handlePass = () => {
		api.send(playerPass(false))
	}

	return state ? (
		<Container faded={faded}>
			{handOpened && (
				<Hand playing={isPlaying} onClose={() => setHandOpened(false)} />
			)}
			{cardsOpened && (
				<PlayedCards
					playing={isPlaying}
					onClose={() => setCardsOpened(false)}
				/>
			)}

			{stackedActions && stackedActions.length > 0 && (
				<CardBuy
					buying={false}
					index={stackedActions[0]}
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
			<CardButtons>
				<Button
					icon={faAngleUp}
					disabled={state.cards.length === 0 || faded}
					onClick={() => setHandOpened(true)}
				>
					{state.cards.length} cards in hand
				</Button>
				<Button
					icon={faAngleUp}
					disabled={state.usedCards.length === 0 || faded}
					onClick={() => setCardsOpened(true)}
				>
					{state.usedCards.length} cards played
				</Button>
			</CardButtons>
			{/*<div>{corporation?.name}</div>*/}
			<Flexed>
				<PassButton
					disabled={!isPlaying || faded}
					onClick={handlePass}
					icon={faArrowRight}
				>
					Pass
				</PassButton>
			</Flexed>
		</Container>
	) : (
		<></>
	)
}

const Container = styled.div<{ faded: boolean }>`
	display: flex;
	justify-content: space-between;
	background-color: rgba(14, 129, 214, 0.8);
	${props =>
		props.faded &&
		css`
			opacity: 0.7;
		`}
`

const Flexed = styled.div`
	flex: 1;
	display: flex;
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
