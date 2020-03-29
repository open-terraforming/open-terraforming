import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useAppStore, useApi } from '@/utils/hooks'
import { Resources } from './components/Resources'
import { Button } from '@/components'
import { Corporations } from '@shared/corporations'
import { playerPass, PlayerStateValue } from '@shared/index'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faBan,
	faArrowRight,
	faAngleUp
} from '@fortawesome/free-solid-svg-icons'

export const Controls = () => {
	const api = useApi()
	const player = useAppStore(state => state.game.player)
	const state = player?.gameState
	const corporation = Corporations.find(c => c.code === state?.corporation)
	const [loading, setLoading] = useState(false)

	const isPlaying = state?.state === PlayerStateValue.Playing

	const handlePass = () => {
		setLoading(true)
		api.send(playerPass(false))
	}

	useEffect(() => {
		setLoading(false)
	}, [isPlaying])

	return state ? (
		<Container>
			<Resources state={state} />
			<div>
				<Button icon={faAngleUp}>{state.cards.length} cards in hand</Button>
			</div>
			<div>
				<Button icon={faAngleUp}>{state.usedCards.length} cards played</Button>
			</div>
			<div>{corporation?.name}</div>
			<div style={{ marginLeft: 'auto' }}>
				<Button
					disabled={!isPlaying || loading}
					onClick={handlePass}
					icon={faArrowRight}
				>
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
