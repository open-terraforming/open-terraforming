import { useAppStore, useWindowEvent, useAnimationFrame } from '@/utils/hooks'
import { PlayerStateValue } from '@shared/index'
import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { CardPicker } from './components/CardPicker/CardPicker'
import { Controls } from './components/Controls/Controls'
import { CorporationPicker } from './components/CorporationPicker/CorporationPicker'
import { GameMap } from './components/GameMap/GameMap'
import { GlobalState } from './components/GlobalState/GlobalState'
import { Players } from './components/Players/Players'
import { useEvents } from '@/context/EventsContext'
import { mouseMoveEvent, RealtimeEventEmit } from '@shared/events'
import { Mouses } from './components/Mouses/Mouses'

export const Table = () => {
	const gameState = useAppStore(state => state.game.state)
	const playerState = useAppStore(state => state.game.player?.state)

	const events = useEvents()
	const lastEvent = useRef<RealtimeEventEmit | null>()

	useAnimationFrame(() => {
		if (lastEvent.current) {
			events.send(lastEvent.current)
			lastEvent.current = null
		}
	})

	useWindowEvent('mousemove', (e: MouseEvent) => {
		const pos = [e.clientX / window.innerWidth, e.clientY / window.innerHeight]

		lastEvent.current = mouseMoveEvent(pos[0], pos[1])
	})

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
			<Mouses />
			{playerState === PlayerStateValue.PickingCorporation && (
				<CorporationPicker />
			)}
			{playerState === PlayerStateValue.PickingCards && <CardPicker />}
			{playerState === PlayerStateValue.PickingPreludes && (
				<CardPicker prelude />
			)}
			<GameContainer>
				<Players />
				<GameMap />
				<GlobalState />
			</GameContainer>
			<Controls />
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
