import { Button } from '@/components'
import { Modal } from '@/components/Modal/Modal'
import { setTableState } from '@/store/modules/table'
import { useAppDispatch, useAppStore } from '@/utils/hooks'
import { CardsLookupApi, CardType } from '@shared/cards'
import { isCardActionable } from '@shared/cards/utils'
import React from 'react'
import { CardDisplay, CardInfo } from '../CardDisplay/CardDisplay'

export const PlayedCards = ({
	onClose,
	playing
}: {
	onClose: () => void
	playing: boolean
}) => {
	const dispatch = useAppDispatch()
	const game = useAppStore(state => state.game.state)
	const player = useAppStore(state => state.game.player)

	const cards = useAppStore(
		state => state.game.player?.gameState.usedCards
	)?.map(
		(c, i) =>
			({
				card: CardsLookupApi.get(c.code),
				state: c,
				index: i
			} as Required<CardInfo>)
	)

	const handleSelect = (cards: Required<CardInfo>[]) => {
		const newlySelected = cards[cards.length - 1]

		if (newlySelected) {
			const card = newlySelected.card

			const playable =
				card &&
				player &&
				game &&
				card.type === CardType.Action &&
				isCardActionable(card, {
					card: newlySelected.state,
					cardIndex: newlySelected.index,
					player: player.gameState,
					playerId: player.id,
					game: game
				})

			if (playable) {
				dispatch(
					setTableState({
						playingCardIndex: newlySelected.index
					})
				)

				onClose()
			}
		}
	}

	return (
		<Modal
			open
			allowClose
			contentStyle={{ width: '90%' }}
			onClose={onClose}
			header={'Cards on table'}
			footer={<Button onClick={onClose}>Close</Button>}
		>
			<CardDisplay
				cards={cards || []}
				onSelect={handleSelect}
				selected={[]}
				defaultType={CardType.Action}
			/>
		</Modal>
	)
}
