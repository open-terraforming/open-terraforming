import React, { useState } from 'react'
import { useAppStore } from '@/utils/hooks'
import { PlayerStateValue } from '@shared/index'
import styled from 'styled-components'
import { Players } from './components/Players/Players'
import { GlobalState } from './components/GlobalState/GlobalState'
import { Controls } from './components/Controls/Controls'
import { CardPicker } from './components/CardPicker/CardPicker'
import { CorporationPicker } from './components/CorporationPicker/CorporationPicker'
import { GameMap } from './components/GameMap/GameMap'
import { Events } from './components/Events/Events'

export const Table = () => {
	const gameState = useAppStore(state => state.game.state?.state)
	const playerState = useAppStore(state => state.game.player?.gameState.state)

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
	align-items: flex-start;
`
