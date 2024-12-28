import { GameModalsProvider } from '@/context/GameModalsContext'
import { useAppStore } from '@/utils/hooks'
import { useEffect } from 'react'
import styled from 'styled-components'
import { Controls } from './components/Controls/Controls'
import { EventList } from './components/EventList/EventList'
import { GameMap } from './components/GameMap/GameMap'
import { GlobalState } from './components/GlobalState/GlobalState'
import { Header } from './components/Header/Header'
import { PendingController } from './components/PendingController'
import { Players } from './components/Players/Players'
import { Spectator } from './components/Spectator/Spectator'

const Table = () => {
	const spectating = useAppStore((state) => state.game.spectating)

	useEffect(() => {
		if (
			Notification.permission !== 'granted' &&
			Notification.permission !== 'denied'
		) {
			Notification.requestPermission()
		}
	}, [Notification.permission])

	return (
		<GameModalsProvider>
			<TableContainer>
				<GameContainer>
					<Header />
					<Players />
					<EventList />
					<GameMap />
					<GlobalState />
				</GameContainer>

				<PendingController />
				{!spectating && <Controls />}
				{spectating && <Spectator />}
			</TableContainer>
		</GameModalsProvider>
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

export default Table
