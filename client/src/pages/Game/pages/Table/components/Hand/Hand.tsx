import React, { useState, useMemo } from 'react'
import { Modal } from '@/components/Modal/Modal'
import { useAppStore, useAppDispatch } from '@/utils/hooks'
import { CardsLookupApi, CardCategory } from '@shared/cards'
import { CardView } from '../CardView/CardView'
import { Button } from '@/components'
import { buyCard } from '@shared/index'
import { CardsContainer, NoCards } from '../CardsContainer/CardsContainer'
import { setTableState } from '@/store/modules/table'
import { useApi } from '@/context/ApiContext'
import {
	isCardPlayable,
	emptyCardState,
	minimalCardPrice
} from '@shared/cards/utils'
import { CardDisplay } from '../CardDisplay/CardDisplay'
import { cardsToCardList } from '@/utils/cards'

export const Hand = ({
	onClose,
	playing
}: {
	onClose: () => void
	playing: boolean
}) => {
	const api = useApi()
	const dispatch = useAppDispatch()
	const player = useAppStore(state => state.game.player)
	const game = useAppStore(state => state.game.state)
	const state = player?.gameState

	const cards =
		useAppStore(state => state.game.player?.gameState.cards)?.map(c =>
			CardsLookupApi.get(c)
		) || []

	const [selected, setSelected] = useState(undefined as number | undefined)

	const selectedCard = useMemo(
		() => (selected !== undefined ? cards && cards[selected] : undefined),
		[selected]
	)

	const handleSelect = (index: number | undefined) => {
		if (index && cards && state && player && game) {
			const card = cards[index]

			const adjusted = minimalCardPrice(card, state)

			const playable =
				card &&
				isCardPlayable(card, {
					card: emptyCardState(card.code),
					cardIndex: -1,
					player: player.gameState,
					playerId: player.id,
					game: game
				})

			if (adjusted > state.money || !playable) {
				return
			}
		}

		setSelected(index)
	}

	const handleConfirm = () => {
		if (selectedCard && selected !== undefined) {
			dispatch(
				setTableState({
					buyingCardIndex: selected
				})
			)
		}

		onClose()
	}

	const selectedPlayable = useMemo(
		() =>
			selectedCard &&
			game &&
			player &&
			isCardPlayable(selectedCard, {
				card: emptyCardState(selectedCard.code),
				cardIndex: -1,
				player: player.gameState,
				playerId: player.id,
				game: game
			}),
		[selectedCard]
	)

	return (
		<Modal
			open={true}
			contentStyle={{ width: '90%' }}
			onClose={onClose}
			header={'Cards in your hand'}
			footer={
				<>
					{playing && selectedCard && (
						<Button
							onClick={handleConfirm}
							disabled={selected !== undefined && !selectedPlayable}
						>
							{`Play ${selectedCard.title}`}
						</Button>
					)}
					<Button onClick={onClose}>Close</Button>
				</>
			}
		>
			<CardDisplay
				buying
				onSelect={c => {
					handleSelect(
						c.length > 0 && c[c.length - 1].index !== selected
							? c[c.length - 1].index
							: undefined
					)
				}}
				selected={
					selectedCard && selected !== undefined
						? [{ card: selectedCard, index: selected }]
						: []
				}
				cards={cards.map((c, i) => ({ card: c, index: i }))}
			/>
		</Modal>
	)
}
