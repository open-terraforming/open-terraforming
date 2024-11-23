import { Button } from '@/components'
import { Modal } from '@/components/Modal/Modal'
import { useApi } from '@/context/ApiContext'
import { usePlayerState } from '@/utils/hooks'
import { CardsLookupApi } from '@shared/cards'
import { discardCards } from '@shared/index'
import { useMemo, useState } from 'react'
import { CardDisplay, CardInfo } from './CardDisplay/CardDisplay'

type Props = {
	count: number
}

export const DiscardCardsModal = ({ count }: Props) => {
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
		<Modal
			contentStyle={{ minWidth: '80%' }}
			open={true}
			hideClose={true}
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
		>
			<CardDisplay
				cards={cards}
				selected={selected}
				onSelect={selectedChanged}
				player={player}
				evaluateMode="viewing"
			/>
		</Modal>
	)
}
