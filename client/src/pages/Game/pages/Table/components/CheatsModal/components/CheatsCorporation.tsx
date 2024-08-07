import { Button } from '@/components'
import { Flex } from '@/components/Flex/Flex'
import { useApi } from '@/context/ApiContext'
import { useAppStore } from '@/utils/hooks'
import { adminChange } from '@shared/actions'
import { CardsLookupApi, CardType } from '@shared/cards'
import { emptyCardState } from '@shared/cards/utils'
import React, { useState } from 'react'

export const CheatsCorporation = () => {
	const api = useApi()
	const game = useAppStore(state => state.game.state)

	const [playerIndex, setPlayerIndex] = useState(0)
	const [card, setCard] = useState('')

	const handleSet = () => {
		const cardData = CardsLookupApi.getOptional(card)

		if (!cardData) {
			alert('Invalid card code')

			return
		}

		const type = cardData.type

		if (type !== CardType.Corporation) {
			alert('Not a corporation card')

			return
		}

		api.send(
			adminChange({
				players: {
					[playerIndex]: {
						corporation: card,
						usedCards: {
							0: emptyCardState(card, 0)
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
				placeholder="Corporation card id"
			/>
			<Button onClick={handleSet}>Set corp</Button>
		</Flex>
	)
}
