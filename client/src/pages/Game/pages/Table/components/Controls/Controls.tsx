import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
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

	const handlePass = () => {
		api.send(playerPass(false))
	}

	return state ? (
		<Container>
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

			<Resources state={state} />
			<div>
				<Button icon={faAngleUp} onClick={() => setHandOpened(true)}>
					{state.cards.length} cards in hand
				</Button>
			</div>
			<div>
				<Button icon={faAngleUp} onClick={() => setCardsOpened(true)}>
					{state.usedCards.length} cards played
				</Button>
			</div>
			<div>{corporation?.name}</div>
			<div style={{ marginLeft: 'auto' }}>
				<Button disabled={!isPlaying} onClick={handlePass} icon={faArrowRight}>
					Pass
				</Button>
			</div>
		</Container>
	) : (
		<></>
	)
}

const Container = styled.div`
	display: flex;
	align-items: center;
	background-color: rgba(14, 129, 214, 0.8);
`
