import { useEvents } from '@/context/EventsContext'
import { useAnimationFrame, useAppStore, useWindowEvent } from '@/utils/hooks'
import { mouseMoveEvent, RealtimeEventEmit } from '@shared/events'
import { PlayerActionType } from '@shared/player-actions'
import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { CardPicker } from './components/CardPicker/CardPicker'
import { Controls } from './components/Controls/Controls'
import { CorporationPicker } from './components/CorporationPicker/CorporationPicker'
import { GameMap } from './components/GameMap/GameMap'
import { GlobalState } from './components/GlobalState/GlobalState'
import { Header } from './components/Header/Header'
import { Mouses } from './components/Mouses/Mouses'
import { Players } from './components/Players/Players'

export const Table = () => {
	const pending = useAppStore(state => state.game.pendingAction)

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
			{pending?.type === PlayerActionType.PickCorporation && (
				<CorporationPicker />
			)}
			{pending?.type === PlayerActionType.PickCards && (
				<CardPicker key={pending.cards.join(',')} />
			)}
			{pending?.type === PlayerActionType.PickPreludes && (
				<CardPicker key={pending.cards.join(',')} prelude />
			)}
			<GameContainer>
				<Header />
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
