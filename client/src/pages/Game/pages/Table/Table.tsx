import { Button } from '@/components'
import { useAppStore } from '@/utils/hooks'
import { faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { PlayerActionType } from '@shared/player-actions'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { CardPicker } from './components/CardPicker/CardPicker'
import { CompetitionsModal } from './components/CompetitionsModal/CompetitionsModal'
import { Controls } from './components/Controls/Controls'
import { CorporationPicker } from './components/CorporationPicker/CorporationPicker'
import { GameMap } from './components/GameMap/GameMap'
import { GlobalState } from './components/GlobalState/GlobalState'
import { Header } from './components/Header/Header'
import { Mouses } from './components/Mouses/Mouses'
import { Players } from './components/Players/Players'
import { Spectator } from './components/Spectator/Spectator'
import { EventList } from './components/EventList/EventList'

const Table = () => {
	const pending = useAppStore(state => state.game.pendingAction)
	const spectating = useAppStore(state => state.game.spectating)
	const [pickerHidden, setPickerHidden] = useState(false)

	/*
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
	*/

	useEffect(() => {
		if (pending?.type !== PlayerActionType.PickCards) {
			setPickerHidden(false)
		}
	}, [pending])

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
			{!pickerHidden && pending?.type === PlayerActionType.PickCards && (
				<CardPicker
					key={pending.cards.join(',')}
					closeable
					onClose={() => setPickerHidden(true)}
				/>
			)}
			{pending?.type === PlayerActionType.PickPreludes && (
				<CardPicker key={pending.cards.join(',')} prelude />
			)}
			{pending?.type === PlayerActionType.SponsorCompetition && (
				<CompetitionsModal freePick onClose={() => null} />
			)}
			<GameContainer>
				<Header />
				<Players />
				<EventList />
				<GameMap />
				<GlobalState />
			</GameContainer>
			<HiddenPicker style={{ opacity: pickerHidden ? 1 : 0 }}>
				<Button icon={faChevronUp} onClick={() => setPickerHidden(false)}>
					BACK TO CARD PICKER
				</Button>
			</HiddenPicker>
			{!spectating && <Controls />}
			{spectating && <Spectator />}
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
	position: relative;
	width: 100%;
	height: 100%;
`

const HiddenPicker = styled.div`
	position: absolute;
	bottom: 6rem;
	left: 50%;
	display: flex;
	justify-content: center;
	width: 20rem;
	margin-left: -10rem;
	z-index: 3;

	transition: opacity 200ms;

	> button {
		padding: 1rem;
	}
`

export default Table
