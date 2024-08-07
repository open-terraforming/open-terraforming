import { Button } from '@/components'
import { Flex } from '@/components/Flex/Flex'
import { useApi } from '@/context/ApiContext'
import { useAppStore } from '@/utils/hooks'
import { adminChange } from '@shared/actions'
import { CardsLookupApi } from '@shared/cards'
import React, { useState } from 'react'

export const CheatsCards = () => {
	const api = useApi()
	const game = useAppStore(state => state.game.state)

	const [playerIndex, setPlayerIndex] = useState(0)
	const [card, setCard] = useState('')

	const player = game.players[playerIndex]

	const handleSet = () => {
		const cardData = CardsLookupApi.getOptional(card)

		if (!cardData) {
			alert('Invalid card code')

			return
		}

		api.send(
			adminChange({
				players: {
					[playerIndex]: {
						cards: {
							[player.cards.length]: card
						}
					}
				}
			})
		)

		setCard('')
	}

	return (
		<Flex>
			<select onChange={e => setPlayerIndex(parseInt(e.target.value))}>
				{game.players.map((player, i) => (
					<option key={i} value={i}>
						{player.name}
					</option>
				))}
			</select>
			<input
				type="text"
				value={card}
				onChange={e => setCard(e.target.value)}
				placeholder="Card id"
			/>
			<Button onClick={handleSet}>Add card</Button>
		</Flex>
	)
}
