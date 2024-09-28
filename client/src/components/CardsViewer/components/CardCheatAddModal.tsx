import { Button } from '@/components/Button/Button'
import { Modal } from '@/components/Modal/Modal'
import { useApi } from '@/context/ApiContext'
import { StatelessCardView } from '@/pages/Game/pages/Table/components/CardView/StatelessCardView'
import { useAppStore } from '@/utils/hooks'
import { adminChange } from '@shared/actions'
import { CardsLookupApi, CardType } from '@shared/cards'
import { emptyCardState } from '@shared/cards/utils'
import { useState } from 'react'

type Props = {
	code: string
	onClose: () => void
}

export const CardCheatAddModal = ({ code, onClose }: Props) => {
	const card = CardsLookupApi.get(code)
	const api = useApi()
	const game = useAppStore((state) => state.game.state)

	const [playerIndex, setPlayerIndex] = useState(0)

	const player = game.players[playerIndex]

	const handleAdd = () => {
		if (!player) {
			return
		}

		if (card.type === CardType.Corporation) {
			api.send(
				adminChange({
					players: {
						[playerIndex]: {
							corporation: card.code,
							usedCards: {
								0: emptyCardState(card.code, 0),
							},
						},
					},
				}),
			)
		} else {
			api.send(
				adminChange({
					players: {
						[playerIndex]: {
							cards: {
								[player.cards.length]: card.code,
							},
						},
					},
				}),
			)
		}

		onClose()
	}

	return (
		<Modal
			header="Add card"
			open={true}
			onClose={onClose}
			footer={
				<Button disabled={!player} onClick={handleAdd}>
					Add
				</Button>
			}
		>
			<StatelessCardView card={card} />

			<select onChange={(e) => setPlayerIndex(parseInt(e.target.value))}>
				{game.players.map((player, i) => (
					<option key={i} value={i}>
						{player.name}
					</option>
				))}
			</select>
		</Modal>
	)
}
