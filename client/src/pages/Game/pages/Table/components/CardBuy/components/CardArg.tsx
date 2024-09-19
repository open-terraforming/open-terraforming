import { Button } from '@/components'
import { useLocale } from '@/context/LocaleContext'
import { cardsToCardList } from '@/utils/cards'
import { useAppStore } from '@/utils/hooks'
import { CardEffectArgument } from '@shared/cards'
import { emptyCardState } from '@shared/cards/utils'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { CardInfo } from '../../CardDisplay/CardDisplay'
import { CardSelector } from '../../CardSelector/CardSelector'
import { ArgContainer } from './ArgContainer'
import { UsedCardState } from '@shared/game'

type Props = {
	arg: CardEffectArgument
	handCardIndex?: number
	cardState: UsedCardState
	otherPlayer?: boolean
	onChange: (v: number | [number, number]) => void
}

export const CardArg = ({
	arg,
	handCardIndex,
	onChange,
	otherPlayer,
	cardState,
}: Props) => {
	const locale = useLocale()

	const [picking, setPicking] = useState(false)
	const player = useAppStore((state) => state.game.player)
	const [selected, setSelected] = useState(undefined as CardInfo | undefined)

	const game = useAppStore((state) => state.game.state)
	const playerState = player
	const playerId = player?.id
	const usedCards = useAppStore((state) => state.game.player?.usedCards)
	const handCards = useAppStore((state) => state.game.player?.cards)

	const players = useMemo(
		() =>
			otherPlayer && game
				? game.players
						.map((p) => ({
							player: p,
							cards: cardsToCardList(p.usedCards, arg.cardConditions, {
								game,
								player: p,
							}).filter((c) =>
								arg.skipCurrentCard
									? p.id !== player.id || c.index !== handCardIndex
									: true,
							),
						}))
						.filter(({ cards }) => cards.length > 0)
				: [],
		[otherPlayer, game, arg, handCardIndex],
	)

	const [selectedPlayer, setSelectedPlayer] = useState(0)

	const cards = useMemo(() => {
		const result =
			usedCards && handCards && game && playerState && playerId
				? cardsToCardList(
						arg.fromHand
							? handCards.map((c) => emptyCardState(c))
							: arg.allowSelfCard
								? // Add the bought card itself as last (to not corrupt indexes), use -13 to mark it
									// By putting the card through cardsToCardList, we ensure it's only shown when compatible with the action
									[...usedCards, emptyCardState(cardState.code, -13)]
								: usedCards,
						arg.cardConditions,
						{
							game,
							player: playerState,
						},
					)
				: []

		// when allowSelfCard is true, we've pushed the card itself to the end, but it has incorrect index
		// -13 is special value that indicates it's indeed the card we added, -1 is a special value that means the card itself
		if (arg.allowSelfCard && result[result.length - 1].state?.index === -13) {
			result[result.length - 1].index = -1
		}

		return result
	}, [usedCards, arg, playerState, game, playerId, handCards])

	console.log({
		allowSelfCard: arg.allowSelfCard,
		arg,
		selfCode: cardState.code,
	})

	const handleSubmit = useCallback(
		(cards: CardInfo[]) => {
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
		},
		[onChange, selectedPlayer],
	)

	const choice = useMemo(
		() =>
			!otherPlayer
				? cards.filter((c) =>
						arg.skipCurrentCard ? c.index !== handCardIndex : true,
					)
				: (players[selectedPlayer]?.cards ?? []),
		[handCardIndex, otherPlayer, arg, players],
	)

	useEffect(() => {
		if (!choice.find((c) => c.index === selected?.index)) {
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
					onChange={(e) => {
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
					{selected ? locale.cards[selected.card.code] : 'Pick card'}
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
					onClose={() => setPicking(false)}
				/>
			)}
		</ArgContainer>
	)
}
