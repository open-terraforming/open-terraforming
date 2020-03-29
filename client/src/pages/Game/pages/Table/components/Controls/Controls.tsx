import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useAppStore, useApi } from '@/utils/hooks'
import { Resources } from './components/Resources'
import { Button } from '@/components'
import { Corporations } from '@shared/corporations'
import { playerPass, PlayerStateValue } from '@shared/index'
import { faArrowRight, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { Hand } from '../Hand/Hand'
import { PlayedCards } from '../PlayedCards/PlayedCards'

export const Controls = () => {
	const api = useApi()
	const player = useAppStore(state => state.game.player)
	const state = player?.gameState
	const corporation = Corporations.find(c => c.code === state?.corporation)
	const [handOpened, setHandOpened] = useState(false)
	const [cardsOpened, setCardsOpened] = useState(false)

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
