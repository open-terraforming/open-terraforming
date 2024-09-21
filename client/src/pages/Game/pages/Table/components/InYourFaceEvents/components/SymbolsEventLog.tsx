import { useLocale } from '@/context/LocaleContext'
import { useAppStore } from '@/utils/hooks'
import { CardResource, Resource, SymbolType } from '@shared/cards'
import { GridCellContent } from '@shared/index'
import { Fragment } from 'react'
import styled from 'styled-components'
import { Symbols } from '../../CardView/components/Symbols'
import { EventType, GameEvent } from '@shared/index'

type Props = {
	events: GameEvent[]
	currentPlayerId: number
	currentUsedCardIndex?: number
	maxWidth?: string
}

export const SymbolsEventLog = ({
	events,
	currentPlayerId,
	currentUsedCardIndex,
	maxWidth = '15rem',
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
				return Object.entries(e.resources).map(([resource, amount]) => (
					<Symbols
						key={resource}
						symbols={[
							...playerSymbol(e.playerId),
							{
								resource: resource as Resource,
								count: amount,
								forceCount: true,
								forceSign: true,
								other: e.playerId !== currentPlayerId,
							},
						]}
					/>
				))
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
								forceCount: true,
								forceSign: true,
								other: e.playerId !== currentPlayerId,
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
							{
								symbol: SymbolType.Card,
								count: e.amount,
								other: e.playerId !== currentPlayerId,
							},
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
							{
								symbol: SymbolType.TerraformingRating,
								count: e.amount,
								forceCount: true,
								forceSign: true,
							},
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
							...playerSymbol(e.playerId),
							{
								resource: e.resource,
								production: true,
								count: e.amount,
								forceCount: true,
								forceSign: true,
								other: e.playerId !== currentPlayerId,
							},
						]}
					/>
				)
			}

			case EventType.ColonyActivated: {
				// TODO: Symbol for this?
				return
			}

			case EventType.TileAcquired: {
				return (
					<Symbols
						symbols={[
							...playerSymbol(e.playerId),
							{ tile: e.tile, tileOther: e.other },
						]}
					/>
				)
			}

			case EventType.TilePlaced: {
				return (
					<Symbols
						symbols={[
							...playerSymbol(e.playerId),
							{ tile: e.tile, tileOther: e.other },
						]}
					/>
				)
			}
		}
	}

	return (
		<E style={{ maxWidth }}>
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
	font-size: 125%;
	max-width: 15rem;
	margin: 1rem auto;
`
