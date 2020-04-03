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
import { isCardPlayable, emptyCardState } from '@shared/cards/utils'

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

	const cards = useAppStore(
		state => state.game.player?.gameState.cards
	)?.map(c => CardsLookupApi.get(c))

	const [selected, setSelected] = useState(undefined as number | undefined)

	const selectedCard = useMemo(
		() => (selected !== undefined ? cards && cards[selected] : undefined),
		[selected]
	)

	const handleSelect = (index: number | undefined) => {
		if (index && cards && state && player && game) {
			const card = cards[index]

			const adjusted =
				!card || !state
					? 0
					: card.cost -
					  (card.categories.includes(CardCategory.Building)
							? state.ore * state.orePrice
							: 0) -
					  (card.categories.includes(CardCategory.Space)
							? state?.titan * state?.titanPrice
							: 0)

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
			contentStyle={{ maxWidth: '90%', width: 'auto', minWidth: '400px' }}
			onClose={onClose}
			header={'Cards in your hand'}
			footer={
				!playing ? (
					<Button onClick={onClose}>Close</Button>
				) : (
					<Button
						onClick={handleConfirm}
						disabled={selected !== undefined && !selectedPlayable}
					>
						{selectedCard ? `Play selected` : 'Close'}
					</Button>
				)
			}
		>
			<CardsContainer>
				{cards?.length === 0 && <NoCards>No cards</NoCards>}
				{cards?.map(
					(c, i) =>
						c && (
							<CardView
								buying
								card={c}
								selected={selected === i}
								key={i}
								onClick={
									playing
										? () => {
												handleSelect(selected === i ? undefined : i)
										  }
										: undefined
								}
							/>
						)
				)}
			</CardsContainer>
		</Modal>
	)
}
