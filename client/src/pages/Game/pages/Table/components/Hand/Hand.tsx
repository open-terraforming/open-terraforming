import React, { useState, useMemo } from 'react'
import { Modal } from '@/components/Modal/Modal'
import { useAppStore, useApi, useAppDispatch } from '@/utils/hooks'
import { CardsLookup } from '@shared/cards'
import { CardView } from '../CardView/CardView'
import { Button } from '@/components'
import { buyCard } from '@shared/index'
import { CardsContainer, NoCards } from '../CardsContainer/CardsContainer'
import { setTableState } from '@/store/modules/table'

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
	const state = player?.gameState

	const cards = useAppStore(state => state.game.player?.gameState.cards)?.map(
		c => CardsLookup[c]
	)

	const [selected, setSelected] = useState(undefined as number | undefined)
	const [loading, setLoading] = useState(false)

	const selectedCard = useMemo(
		() => selected !== undefined && cards && cards[selected],
		[selected]
	)

	const canAfford = state && selectedCard && selectedCard.cost <= state.money

	const handleConfirm = () => {
		if (selectedCard && selected !== undefined && canAfford) {
			dispatch(
				setTableState({
					buyingCardIndex: selected
				})
			)
		}

		onClose()
	}

	return (
		<Modal
			open={true}
			contentStyle={{ maxWidth: '90%', width: 'auto', minWidth: '400px' }}
			onClose={onClose}
			header={'Cards in your hand'}
			footer={
				!playing ? (
					<Button onClick={onClose}>Close</Button>
				) : !canAfford && selectedCard ? (
					`You cannot afford card for ${selectedCard.cost}`
				) : (
					<Button
						onClick={handleConfirm}
						disabled={loading}
						isLoading={loading}
					>
						{selectedCard ? `Play for ${selectedCard.cost}` : 'Close'}
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
								card={c}
								selected={selected === i}
								key={i}
								onClick={
									!loading && playing
										? () => {
												setSelected(selected === i ? undefined : i)
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
