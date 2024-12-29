import { Button } from '@/components'
import { useApi } from '@/context/ApiContext'
import { usePlayerState } from '@/utils/hooks'
import { CardsLookupApi } from '@shared/cards'
import { discardCards } from '@shared/index'
import { useMemo, useState } from 'react'
import { CardDisplayModal, CardInfo } from './CardDisplayModal/CardDisplayModal'

type Props = {
	count: number
	onClose: () => void
}

export const DiscardCardsModal = ({ count, onClose }: Props) => {
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
		api.send(discardCards(selected.map((c) => c.index)))
	}

	const selectedChanged = (cards: CardInfo[]) => {
		setSelected(cards.slice(cards.length - 2, cards.length))
	}

	return (
		<CardDisplayModal
			contentStyle={{ minWidth: '80%' }}
			onClose={onClose}
			header="Discard cards"
			footer={
				<>
					<Button onClick={handleConfirm} disabled={selected.length !== count}>
						{selected.length === count
							? `Discard ${count} cards`
							: `Select ${count} cards`}
					</Button>
				</>
			}
			cards={cards}
			selected={selected}
			onSelect={selectedChanged}
			player={player}
			evaluateMode="viewing"
			closeAsMinimize
		/>
	)
}
