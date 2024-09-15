import { Button } from '@/components'
import { Flex } from '@/components/Flex/Flex'
import { useApi } from '@/context/ApiContext'
import { useAppStore } from '@/utils/hooks'
import { adminChange } from '@shared/actions'
import { CardsLookupApi } from '@shared/cards'
import { useEffect, useState } from 'react'

export const CheatsCardResources = () => {
	const api = useApi()
	const game = useAppStore((state) => state.game.state)

	const [playerIndex, setPlayerIndex] = useState(0)
	const [cardIndex, setCardIndex] = useState(0)
	const [value, setValue] = useState(0)

	const selectedCard = game.players[playerIndex].usedCards[cardIndex]

	const selectedCardInfo = selectedCard
		? CardsLookupApi.get(selectedCard.code)
		: null

	const handleSet = () => {
		if (!selectedCardInfo?.resource) {
			return
		}

		api.send(
			adminChange({
				players: {
					[playerIndex]: {
						usedCards: {
							[cardIndex]: {
								[selectedCardInfo.resource]: value,
							},
						},
					},
				},
			}),
		)
	}

	useEffect(() => {
		if (!selectedCard || !selectedCardInfo?.resource) {
			return
		}

		setValue(selectedCard[selectedCardInfo.resource])
	}, [selectedCard, selectedCardInfo])

	return (
		<Flex>
			CARD RES:
			<select onChange={(e) => setPlayerIndex(parseInt(e.target.value))}>
				{game.players.map((player, i) => (
					<option key={i} value={i}>
						{player.name}
					</option>
				))}
			</select>
			<select onChange={(e) => setCardIndex(parseInt(e.target.value))}>
				{game.players[playerIndex].usedCards
					.map((card, i) => ({ card, i }))
					.filter(({ card }) => !!CardsLookupApi.get(card.code).resource)
					.map(({ card, i }) => (
						<option key={i} value={i}>
							{card.code}
						</option>
					))}
			</select>
			{selectedCardInfo?.resource}:
			<input
				type="number"
				value={value}
				onChange={(e) => setValue(parseFloat(e.target.value))}
			/>
			<Button onClick={handleSet}>Set</Button>
		</Flex>
	)
}
