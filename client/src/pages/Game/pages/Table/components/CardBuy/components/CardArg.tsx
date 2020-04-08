import React, { useState, useMemo, useCallback, useEffect } from 'react'
import {
	CardEffectArgument,
	CardsLookupApi,
	CardCondition,
	CardCallbackContext
} from '@shared/cards'
import { CardInfo } from '../../CardDisplay/CardDisplay'
import { Button } from '@/components'
import { ArgContainer } from './ArgContainer'
import { CardSelector } from '../../CardSelector/CardSelector'
import { useAppStore } from '@/utils/hooks'
import { emptyCardState } from '@shared/cards/utils'
import { UsedCardState } from '@shared/index'
import { cardsToCardList } from '@/utils/cards'

type Props = {
	arg: CardEffectArgument
	otherPlayer?: boolean
	onChange: (v: number | [number, number]) => void
}

export const CardArg = ({ arg, onChange, otherPlayer }: Props) => {
	const [picking, setPicking] = useState(false)
	const player = useAppStore(state => state.game.player)
	const [selected, setSelected] = useState(undefined as CardInfo | undefined)

	const game = useAppStore(state => state.game.state)
	const playerState = player
	const playerId = player?.id
	const usedCards = useAppStore(state => state.game.player?.usedCards)
	const handCards = useAppStore(state => state.game.player?.cards)

	const players = useMemo(
		() =>
			otherPlayer && game
				? game.players
						.map(p => ({
							player: p,
							cards: cardsToCardList(p.usedCards, arg.cardConditions, {
								game,
								player: p,
								playerId: p.id
							})
						}))
						.filter(({ cards }) => cards.length > 0)
				: [],
		[otherPlayer, game, arg]
	)

	const [selectedPlayer, setSelectedPlayer] = useState(0)

	const cards = useMemo(
		() =>
			usedCards && handCards && game && playerState && playerId
				? cardsToCardList(
						arg.fromHand ? handCards.map(c => emptyCardState(c)) : usedCards,
						arg.cardConditions,
						{
							game,
							player: playerState,
							playerId
						}
				  )
				: [],
		[usedCards]
	)

	const handleSubmit = useCallback((cards: CardInfo[]) => {
		setPicking(false)

		if (cards.length === 0) {
			return
		}

		setSelected(cards[0])

		if (otherPlayer) {
			onChange([players[selectedPlayer].player.id, cards[0]?.index])
		} else {
			onChange(cards[0]?.index)
		}
	}, [])

	const choice = !otherPlayer ? cards : players[selectedPlayer].cards

	useEffect(() => {
		if (!choice.find(c => c.index === selected?.index)) {
			handleSubmit(choice)
		}
	}, [choice, selected, handleSubmit])

	const enableCardPicker =
		!otherPlayer || (selectedPlayer !== undefined && players[selectedPlayer])

	return (
		<ArgContainer>
			<span>{arg.descriptionPrefix}</span>
			{otherPlayer && (
				<select
					value={selectedPlayer}
					onChange={e => {
						setSelectedPlayer(parseInt(e.target.value, 10))
					}}
				>
					{players.map((p, i) => (
						<option key={p.player.id} value={i}>
							{p.player.name}
						</option>
					))}
				</select>
			)}
			{enableCardPicker && (
				<Button onClick={() => setPicking(true)}>
					{selected ? selected.card.title : 'Pick card'}
				</Button>
			)}
			<span>{arg.descriptionPostfix}</span>
			{picking && (
				<CardSelector
					title={'Select a card'}
					cards={choice}
					limit={1}
					onSubmit={handleSubmit}
					filters={false}
				/>
			)}
		</ArgContainer>
	)
}
