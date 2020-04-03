import { Button } from '@/components'
import { Modal } from '@/components/Modal/Modal'
import { setTableState } from '@/store/modules/table'
import { useAppDispatch, useAppStore } from '@/utils/hooks'
import { CardsLookupApi, CardType } from '@shared/cards'
import { isCardActionable, card } from '@shared/cards/utils'
import React, { useMemo, useState } from 'react'
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

	const [selected, setSelected] = useState(
		undefined as Required<CardInfo> | undefined
	)

	const handleConfirm = () => {
		if (selected !== undefined) {
			dispatch(
				setTableState({
					playingCardIndex: selected.index
				})
			)
		}

		onClose()
	}

	const handleSelect = (cards: Required<CardInfo>[]) => {
		const selected = cards[0]

		if (selected) {
			if (selected.card.type !== CardType.Action || selected.state.played) {
				return
			}
		}

		setSelected(selected)
	}

	const selectedPlayable = useMemo(
		() =>
			selected &&
			game &&
			player &&
			isCardActionable(selected.card, {
				card: selected.state,
				cardIndex: selected.index,
				player: player.gameState,
				playerId: player.id,
				game: game
			}),
		[selected]
	)

	const selectedList = useMemo(() => (selected ? [selected] : []), [selected])

	return (
		<Modal
			open={true}
			contentStyle={{ width: '90%' }}
			onClose={onClose}
			header={'Cards on table'}
			footer={
				!playing ? (
					<Button onClick={onClose}>Close</Button>
				) : (
					<Button
						onClick={handleConfirm}
						disabled={selected !== undefined && !selectedPlayable}
					>
						{selected !== undefined ? `Play ${selected.card.title}` : 'Close'}
					</Button>
				)
			}
		>
			<CardDisplay
				cards={cards || []}
				onSelect={handleSelect}
				selected={selectedList}
				defaultType={CardType.Action}
			/>
		</Modal>
	)
}
