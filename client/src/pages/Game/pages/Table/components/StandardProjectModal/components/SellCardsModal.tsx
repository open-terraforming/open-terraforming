import { Button } from '@/components'
import { Modal } from '@/components/Modal/Modal'
import { useApi } from '@/context/ApiContext'
import { PickHandCardsFrontendAction } from '@/store/modules/table/frontendActions'
import { useAppDispatch, usePlayerState } from '@/utils/hooks'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { CardsLookupApi } from '@shared/cards'
import { buyStandardProject, StandardProjectType } from '@shared/index'
import { withUnits } from '@shared/units'
import { useMemo, useState } from 'react'
import { CardDisplay, CardInfo } from '../../CardDisplay/CardDisplay'
import { popFrontendAction } from '@/store/modules/table'

type Props = {
	project: StandardProjectType
	action: PickHandCardsFrontendAction
}

export const HandCardsPickerModal = ({ project }: Props) => {
	const api = useApi()
	const dispatch = useAppDispatch()
	const player = usePlayerState()
	const playerCards = player.cards
	const [selected, setSelected] = useState([] as CardInfo[])

	const cards = useMemo(
		() =>
			playerCards
				? playerCards.map(
						(c, i) =>
							({
								card: CardsLookupApi.get(c),
								index: i,
							}) as CardInfo,
					)
				: [],
		[playerCards],
	)

	const handleConfirm = () => {
		api.send(buyStandardProject(project, [selected.map((c) => c.index)]))

		dispatch(popFrontendAction())
	}

	const handleClose = () => {
		dispatch(popFrontendAction())
	}

	return (
		<Modal
			contentStyle={{ minWidth: '80%' }}
			open={true}
			onClose={handleClose}
			footer={
				<>
					{selected.length > 0 && (
						<Button onClick={handleConfirm}>
							Sell cards for {withUnits('money', selected.length)}
						</Button>
					)}
					<Button schema={'transparent'} onClick={handleClose} icon={faTimes}>
						Cancel
					</Button>
				</>
			}
		>
			<CardDisplay
				cards={cards}
				selected={selected}
				onSelect={(cards) => {
					setSelected(cards)
				}}
				player={player}
				evaluateMode="viewing"
			/>
		</Modal>
	)
}
