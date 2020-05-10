import { Modal } from '@/components/Modal/Modal'
import { setTableState } from '@/store/modules/table'
import { useAppDispatch, useAppStore } from '@/utils/hooks'
import { CardsLookupApi } from '@shared/cards'
import {
	emptyCardState,
	isCardPlayable,
	minimalCardPrice
} from '@shared/cards/utils'
import React from 'react'
import { CardDisplay } from '../CardDisplay/CardDisplay'

export const Hand = ({
	onClose,
	playing
}: {
	onClose: () => void
	playing: boolean
}) => {
	const dispatch = useAppDispatch()
	const player = useAppStore(state => state.game.player)
	const game = useAppStore(state => state.game.state)
	const state = player

	const cards =
		useAppStore(state => state.game.player?.cards)?.map(c =>
			CardsLookupApi.get(c)
		) || []

	const handleSelect = (index: number | undefined) => {
		if (!playing) {
			return
		}

		if (index !== undefined && cards && state && player && game) {
			const card = cards[index]

			const adjusted = minimalCardPrice(card, state)

			const playable =
				card &&
				isCardPlayable(card, {
					card: emptyCardState(card.code),
					cardIndex: -1,
					player: player,
					playerId: player.id,
					game: game
				})

			if (adjusted > state.money || !playable) {
				return
			}

			dispatch(
				setTableState({
					buyingCardIndex: index
				})
			)

			onClose()
		}
	}

	return (
		<Modal
			open={true}
			contentStyle={{ minWidth: '80%' }}
			onClose={onClose}
			header={'Cards in your hand'}
			bodyStyle={{ display: 'flex', flexDirection: 'column' }}
		>
			<CardDisplay
				buying
				onSelect={c => {
					handleSelect(c.length > 0 ? c[c.length - 1].index : undefined)
				}}
				selected={[]}
				cards={cards.map((c, i) => ({ card: c, index: i }))}
			/>
		</Modal>
	)
}
