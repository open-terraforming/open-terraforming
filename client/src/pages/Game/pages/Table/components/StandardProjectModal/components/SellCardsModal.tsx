import { Button } from '@/components'
import { Modal } from '@/components/Modal/Modal'
import { useApi } from '@/context/ApiContext'
import { usePlayerState } from '@/utils/hooks'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { CardsLookupApi } from '@shared/cards'
import { buyStandardProject, StandardProjectType } from '@shared/index'
import { withUnits } from '@shared/units'
import { useMemo, useState } from 'react'
import { CardDisplay, CardInfo } from '../../CardDisplay/CardDisplay'

type Props = {
	onClose: () => void
}

export const SellCardsModal = ({ onClose }: Props) => {
	const api = useApi()
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
		api.send(
			buyStandardProject(
				StandardProjectType.SellPatents,
				selected.map((c) => c.index),
			),
		)

		onClose()
	}

	return (
		<Modal
			contentStyle={{ minWidth: '80%' }}
			open={true}
			onClose={onClose}
			footer={
				<>
					{selected.length > 0 && (
						<Button onClick={handleConfirm}>
							Sell cards for {withUnits('money', selected.length)}
						</Button>
					)}
					<Button schema={'transparent'} onClick={onClose} icon={faTimes}>
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
