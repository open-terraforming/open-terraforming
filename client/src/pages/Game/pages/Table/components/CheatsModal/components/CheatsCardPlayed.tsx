import { Button } from '@/components'
import { Flex } from '@/components/Flex/Flex'
import { useApi } from '@/context/ApiContext'
import { useAppStore } from '@/utils/hooks'
import { adminChange } from '@shared/actions'
import { CardsLookupApi } from '@shared/cards'
import { useEffect, useMemo, useState } from 'react'

export const CheatsCardPlayed = () => {
	const api = useApi()
	const game = useAppStore((state) => state.game.state)

	const [playerIndex, setPlayerIndex] = useState(0)
	const [cardIndex, setCardIndex] = useState(0)
	const [value, setValue] = useState(false)

	const cards = useMemo(
		() =>
			game.players[playerIndex].usedCards
				.map((card, i) => ({ card, i }))
				.filter(
					({ card }) => CardsLookupApi.get(card.code).actionEffects.length > 0,
				),
		[game, playerIndex],
	)

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
								played: value,
							},
						},
					},
				},
			}),
		)
	}

	useEffect(() => {
		setCardIndex(cards[0].i)
	}, [cards])

	useEffect(() => {
		if (!selectedCard) {
			return
		}

		setValue(selectedCard.played)
	}, [selectedCard, selectedCardInfo])

	return (
		<Flex>
			CARD PLAYED:
			<select onChange={(e) => setPlayerIndex(parseInt(e.target.value))}>
				{game.players.map((player, i) => (
					<option key={i} value={i}>
						{player.name}
					</option>
				))}
			</select>
			<select onChange={(e) => setCardIndex(parseInt(e.target.value))}>
				{cards.map(({ card, i }) => (
					<option key={i} value={i}>
						{card.code}
					</option>
				))}
			</select>
			<label>
				<input
					type="checkbox"
					checked={value}
					onChange={(e) => setValue(e.target.checked)}
				/>
				Played
			</label>
			<Button onClick={handleSet}>Set</Button>
		</Flex>
	)
}
