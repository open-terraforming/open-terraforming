import { Button } from '@/components'
import { useApi } from '@/context/ApiContext'
import { FrontendPendingActionType } from '@/store/modules/table/frontendActions'
import { useAppStore } from '@/utils/hooks'
import { faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { changeColonyStep } from '@shared/actions'
import { ColoniesLookupApi } from '@shared/ColoniesLookupApi'
import { PlayerActionType } from '@shared/player-actions'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { styled } from 'styled-components'
import { ColoniesModal } from './ColoniesModal/ColoniesModal'
import { CompetitionsModal } from './CompetitionsModal/CompetitionsModal'
import { AddCardResourceModal } from './Controls/components/AddCardResourceModal'
import { DiscardCardsModal } from './DiscardCardsModal'
import { PendingCardPicker } from './PendingCardPicker/PendingCardPicker'
import { SolarPhaseTerraformPicker } from './SolarPhaseTerraformPicker/SolarPhaseTerraformPicker'
import { HandCardsPickerModal } from './StandardProjectModal/components/SellCardsModal'
import { StartPicker } from './StartPicker/StartPicker'

export const PendingController = () => {
	const pending = useAppStore((state) => state.game.pendingAction)

	const frontendPending = useAppStore(
		(state) => state.table.pendingFrontendActions[0],
	)

	const [pendingHidden, setPendingHidden] = useState(false)
	const colonies = useAppStore((state) => state.game.state.colonies)
	const api = useApi()

	const hidePending = useCallback(() => {
		setPendingHidden(true)
	}, [])

	const showPending = useCallback(() => {
		setPendingHidden(false)
	}, [])

	const pendingText = useMemo(() => {
		switch (pending?.type) {
			case PlayerActionType.PickStarting:
				return 'Pick starting hand'
			case PlayerActionType.PickCards:
				return 'Pick cards'
			case PlayerActionType.PickPreludes:
				return 'Pick preludes'
			case PlayerActionType.DraftCard:
				return 'Draft card'
			case PlayerActionType.WorldGovernmentTerraform:
				return 'Terraform'
			case PlayerActionType.SponsorCompetition:
				return 'Sponsor Competition'
			case PlayerActionType.BuildColony:
				return 'Build colony'
			case PlayerActionType.TradeWithColony:
				return 'Trade with colony'
			case PlayerActionType.ChangeColonyStep:
				return 'Change colony step'
			case PlayerActionType.AddCardResource:
				return 'Add card resource'
			case PlayerActionType.DiscardCards:
				return 'Discard cards'
			default:
				return 'Pending action'
		}
	}, [pending])

	// Make sure any new pending is always shown
	useEffect(() => {
		setPendingHidden(false)
	}, [pending])

	return (
		<>
			{pending?.type === PlayerActionType.PickStarting && (
				<StartPicker open={!pendingHidden} onClose={hidePending} />
			)}

			{!pendingHidden &&
				(pending?.type === PlayerActionType.PickCards ||
					pending?.type === PlayerActionType.PickPreludes ||
					pending?.type === PlayerActionType.DraftCard) && (
					<PendingCardPicker
						key={pending.cards.join(',')}
						action={pending}
						closeable
						onClose={hidePending}
					/>
				)}

			{!pendingHidden &&
				pending?.type === PlayerActionType.WorldGovernmentTerraform && (
					<SolarPhaseTerraformPicker action={pending} onClose={hidePending} />
				)}

			{!pendingHidden &&
				pending?.type === PlayerActionType.SponsorCompetition && (
					<CompetitionsModal freePick onClose={hidePending} closeAsMinimize />
				)}

			{!pendingHidden && pending?.type === PlayerActionType.BuildColony && (
				<ColoniesModal
					freeColonizePick
					closeAsMinimize
					allowDuplicateColonies={pending.data.allowMoreColoniesPerColony}
					onClose={hidePending}
				/>
			)}

			{!pendingHidden && pending?.type === PlayerActionType.TradeWithColony && (
				<ColoniesModal freeTradePick closeAsMinimize onClose={hidePending} />
			)}

			{!pendingHidden &&
				pending?.type === PlayerActionType.ChangeColonyStep && (
					<ColoniesModal
						closeAsMinimize
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
						onClose={hidePending}
					/>
				)}

			{!pendingHidden && pending?.type === PlayerActionType.AddCardResource && (
				<AddCardResourceModal pendingAction={pending} onClose={hidePending} />
			)}

			{!pendingHidden && pending?.type === PlayerActionType.DiscardCards && (
				<DiscardCardsModal count={pending.data.count} onClose={hidePending} />
			)}

			{frontendPending &&
				frontendPending.type === FrontendPendingActionType.PickHandCards && (
					<HandCardsPickerModal
						action={frontendPending}
						project={frontendPending.project}
					/>
				)}

			<HiddenPicker style={{ opacity: pendingHidden ? 1 : 0 }}>
				<Button icon={faChevronUp} onClick={showPending}>
					Back to {pendingText}
				</Button>
			</HiddenPicker>
		</>
	)
}

export const HiddenPicker = styled.div`
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
