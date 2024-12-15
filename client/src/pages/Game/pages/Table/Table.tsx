import { Button } from '@/components'
import { useAppStore } from '@/utils/hooks'
import { faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { PlayerActionType } from '@shared/player-actions'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { CompetitionsModal } from './components/CompetitionsModal/CompetitionsModal'
import { Controls } from './components/Controls/Controls'
import { EventList } from './components/EventList/EventList'
import { GameMap } from './components/GameMap/GameMap'
import { GlobalState } from './components/GlobalState/GlobalState'
import { Header } from './components/Header/Header'
import { Mouses } from './components/Mouses/Mouses'
import { PendingCardPicker } from './components/PendingCardPicker/PendingCardPicker'
import { Players } from './components/Players/Players'
import { Spectator } from './components/Spectator/Spectator'
import { StartPicker } from './components/StartPicker/StartPicker'
import { SolarPhaseTerraformPicker } from './components/SolarPhaseTerraformPicker/SolarPhaseTerraformPicker'
import { ColoniesModal } from './components/ColoniesModal/ColoniesModal'
import { useApi } from '@/context/ApiContext'
import { changeColonyStep } from '@shared/actions'
import { AddCardResourceModal } from './components/Controls/components/AddCardResourceModal'
import { GameModalsProvider } from '@/context/GameModalsContext'
import { ColoniesLookupApi } from '@shared/ColoniesLookupApi'
import { DiscardCardsModal } from './components/DiscardCardsModal'
import { FrontendPendingActionType } from '@/store/modules/table/frontendActions'
import { HandCardsPickerModal } from './components/StandardProjectModal/components/SellCardsModal'

const Table = () => {
	const pending = useAppStore((state) => state.game.pendingAction)

	const frontendPending = useAppStore(
		(state) => state.table.pendingFrontendActions[0],
	)

	const spectating = useAppStore((state) => state.game.spectating)
	const [pickerHidden, setPickerHidden] = useState(false)
	const colonies = useAppStore((state) => state.game.state.colonies)
	const api = useApi()

	useEffect(() => {
		if (
			pending?.type !== PlayerActionType.PickCards &&
			pending?.type !== PlayerActionType.PickPreludes &&
			pending?.type !== PlayerActionType.DraftCard
		) {
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
		<GameModalsProvider>
			<TableContainer>
				<Mouses />

				{pending?.type === PlayerActionType.PickStarting && <StartPicker />}

				{!pickerHidden &&
					(pending?.type === PlayerActionType.PickCards ||
						pending?.type === PlayerActionType.PickPreludes ||
						pending?.type === PlayerActionType.DraftCard) && (
						<PendingCardPicker
							key={pending.cards.join(',')}
							action={pending}
							closeable
							onClose={() => setPickerHidden(true)}
						/>
					)}

				{pending?.type === PlayerActionType.SolarPhaseTerraform && (
					<SolarPhaseTerraformPicker action={pending} />
				)}

				{pending?.type === PlayerActionType.SponsorCompetition && (
					<CompetitionsModal freePick onClose={() => null} />
				)}

				{pending?.type === PlayerActionType.BuildColony && (
					<ColoniesModal
						freeColonizePick
						disableClose
						allowDuplicateColonies={pending.data.allowMoreColoniesPerColony}
						onClose={() => null}
					/>
				)}

				{pending?.type === PlayerActionType.TradeWithColony && (
					<ColoniesModal freeTradePick disableClose onClose={() => null} />
				)}

				{pending?.type === PlayerActionType.ChangeColonyStep && (
					<ColoniesModal
						disableClose
						customAction={(index) => {
							const colony = colonies[index]
							const colonyInfo = ColoniesLookupApi.get(colony.code)
							const change = pending.data.change

							return {
								enabled:
									change > 0
										? colony.step < colonyInfo.tradeIncome.slots.length - 1
										: colony.step > 0,
								label: change > 0 ? `+${change} step` : `${change} step`,
								perform: () => {
									api.send(changeColonyStep(index))
								},
							}
						}}
						onClose={() => null}
					/>
				)}

				{pending?.type === PlayerActionType.AddCardResource && (
					<AddCardResourceModal pendingAction={pending} />
				)}

				{pending?.type === PlayerActionType.DiscardCards && (
					<DiscardCardsModal count={pending.data.count} />
				)}

				{frontendPending &&
					frontendPending.type === FrontendPendingActionType.PickHandCards && (
						<HandCardsPickerModal
							action={frontendPending}
							project={frontendPending.project}
						/>
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
