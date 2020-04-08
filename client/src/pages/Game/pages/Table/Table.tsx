import { useAppStore } from '@/utils/hooks'
import { PlayerStateValue } from '@shared/index'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { CardPicker } from './components/CardPicker/CardPicker'
import { Controls } from './components/Controls/Controls'
import { CorporationPicker } from './components/CorporationPicker/CorporationPicker'
import { Events } from './components/Events/Events'
import { GameMap } from './components/GameMap/GameMap'
import { GlobalState } from './components/GlobalState/GlobalState'
import { Players } from './components/Players/Players'

export const Table = () => {
	const gameState = useAppStore(state => state.game.state)
	const playerState = useAppStore(state => state.game.player?.state)

	useEffect(() => {
		if (
			Notification.permission !== 'granted' &&
			Notification.permission !== 'denied'
		) {
			Notification.requestPermission()
		}
	}, [Notification.permission])

	return (
		<TableContainer>
			{playerState === PlayerStateValue.PickingCorporation && (
				<CorporationPicker />
			)}
			{playerState === PlayerStateValue.PickingCards && <CardPicker />}
			<GameContainer>
				<Players />
				<GameMap />
				<GlobalState />
			</GameContainer>
			<Controls />
			<Events />
		</TableContainer>
	)
}

const TableContainer = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	min-width: 0;
`

const GameContainer = styled.div`
	display: flex;
	flex-grow: 1;
	width: 100%;
	min-height: 0;
	max-height: 100%;
`
