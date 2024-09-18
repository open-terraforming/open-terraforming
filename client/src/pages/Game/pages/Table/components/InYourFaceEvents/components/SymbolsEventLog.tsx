import { useLocale } from '@/context/LocaleContext'
import { useAppStore } from '@/utils/hooks'
import { CardResource, CardSymbol, Resource, SymbolType } from '@shared/cards'
import { GridCellContent } from '@shared/game'
import { Fragment } from 'react'
import { Symbols } from '../../CardView/components/Symbols'
import { EventType, GameEvent } from '../../EventList/types'
import styled from 'styled-components'

type Props = {
	events: GameEvent[]
	currentPlayerId: number
	currentUsedCardIndex?: number
}

export const SymbolsEventLog = ({
	events,
	currentPlayerId,
	currentUsedCardIndex,
}: Props) => {
	const players = useAppStore((state) => state.game.playerMap)
	const t = useLocale()

	const playerSymbol = (playerId: number) =>
		playerId === currentPlayerId
			? []
			: [
					{
						symbol: SymbolType.Player,
						color: players[playerId].color,
						title: players[playerId].name,
					},
				]

	const eventToSymbols = (e: GameEvent) => {
		switch (e.type) {
			case EventType.ResourcesChanged: {
				return (
					<Symbols
						symbols={[
							...playerSymbol(e.playerId),
							...Object.entries(e.resources).map(
								([resource, amount]): CardSymbol => ({
									resource: resource as Resource,
									count: amount,
								}),
							),
						]}
					/>
				)
			}

			case EventType.CardResourceChanged: {
				// TODO: What if the card index is different?
				return (
					<Symbols
						symbols={[
							...playerSymbol(e.playerId),
							...(e.index !== currentUsedCardIndex
								? [{ text: t.cards[e.card] }]
								: []),
							{
								cardResource: e.resource as CardResource,
								count: e.amount,
							},
						]}
					/>
				)
			}

			case EventType.CardsReceived: {
				return (
					<Symbols
						symbols={[
							...playerSymbol(e.playerId),
							{ symbol: SymbolType.Card, count: e.amount },
						]}
					/>
				)
			}

			case EventType.GameProgressChanged: {
				if (e.progress === 'temperature') {
					return (
						<Symbols
							symbols={[{ symbol: SymbolType.Temperature, count: e.amount }]}
						/>
					)
				}

				if (e.progress === 'oxygen') {
					return (
						<Symbols
							symbols={[{ symbol: SymbolType.Oxygen, count: e.amount }]}
						/>
					)
				}

				if (e.progress === 'oceans') {
					return (
						<Symbols
							symbols={[{ tile: GridCellContent.Ocean, count: e.amount }]}
						/>
					)
				}

				if (e.progress === 'venus') {
					return (
						<Symbols
							symbols={[{ symbol: SymbolType.Venus, count: e.amount }]}
						/>
					)
				}

				return
			}

			case EventType.RatingChanged: {
				return (
					<Symbols
						symbols={[
							...playerSymbol(e.playerId),
							{ symbol: SymbolType.TerraformingRating, count: e.amount },
						]}
					/>
				)
			}

			case EventType.PlayerTradeFleetsChange: {
				return (
					<Symbols
						symbols={[
							...playerSymbol(e.playerId),
							{ symbol: SymbolType.TradeFleet, count: e.amount },
						]}
					/>
				)
			}

			case EventType.ProductionChanged: {
				return (
					<Symbols
						symbols={[
							{ resource: e.resource, production: true, count: e.amount },
						]}
					/>
				)
			}

			case EventType.ColonyActivated: {
				// TODO: Symbol for this?
				return
			}
		}
	}

	return (
		<E>
			{events.map((e, i) => (
				<Fragment key={i}>{eventToSymbols(e)}</Fragment>
			))}
		</E>
	)
}

const E = styled.div`
	display: flex;
	gap: 0.6rem;
	flex-wrap: wrap;
	justify-content: center;
	margin: 1rem 0;
	font-size: 125%;
`
