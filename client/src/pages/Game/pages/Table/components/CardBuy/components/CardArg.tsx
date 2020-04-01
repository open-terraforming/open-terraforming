import React, { useState, useMemo, useCallback } from 'react'
import { CardEffectArgument, CardsLookupApi } from '@shared/cards'
import { CardInfo } from '../../CardDisplay/CardDisplay'
import { Button } from '@/components'
import { ArgContainer } from './ArgContainer'
import { CardSelector } from '../../CardSelector/CardSelector'
import { useAppStore } from '@/utils/hooks'
import { emptyCardState } from '@shared/cards/utils'

type Props = {
	arg: CardEffectArgument
	onChange: (v: number) => void
}

export const CardArg = ({ arg, onChange }: Props) => {
	const [picking, setPicking] = useState(false)
	const [selected, setSelected] = useState(undefined as CardInfo | undefined)

	const player = useAppStore(state => state.game.player)
	const game = useAppStore(state => state.game.state)
	const playerState = player?.gameState
	const playerId = player?.id
	const usedCards = useAppStore(state => state.game.player?.gameState.usedCards)

	const cards = useMemo(
		() =>
			usedCards && game && playerState && playerId
				? usedCards
						.map(
							(c, i) =>
								({
									card: CardsLookupApi.get(c.code),
									index: i,
									state: c
								} as CardInfo)
						)
						.filter(item =>
							arg.cardConditions.every(c =>
								c.evaluate({
									card: item.state || emptyCardState(item.card.code),
									cardIndex: item.index,
									game,
									player: playerState,
									playerId
								})
							)
						)
				: [],
		[usedCards]
	)

	const handleSubmit = useCallback((cards: CardInfo[]) => {
		setSelected(cards[0])
		setPicking(false)
		onChange(cards[0]?.index)
	}, [])

	return (
		<ArgContainer>
			<span>{arg.description}</span>{' '}
			<Button onClick={() => setPicking(true)}>
				{selected ? selected.card.title : 'Pick card'}
			</Button>
			{picking && (
				<CardSelector
					title={arg.description}
					cards={cards}
					limit={1}
					onSubmit={handleSubmit}
					filters={false}
				/>
			)}
		</ArgContainer>
	)
}
