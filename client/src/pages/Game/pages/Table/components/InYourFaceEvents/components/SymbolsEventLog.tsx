import { useLocale } from '@/context/LocaleContext'
import { useAppStore } from '@/utils/hooks'
import { CardResource, CardSymbol, Resource, SymbolType } from '@shared/cards'
import { EventType, GameEvent, GridCellContent } from '@shared/index'
import { useMemo } from 'react'
import styled, { keyframes } from 'styled-components'
import { SymbolDisplay } from '../../CardView/components/SymbolDisplay'

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

	const eventToSymbols = (e: GameEvent): CardSymbol[] => {
		switch (e.type) {
			case EventType.ResourcesChanged: {
				return Object.entries(e.resources).flatMap(([resource, amount]) => [
					...playerSymbol(e.playerId),
					{
						resource: resource as Resource,
						count: amount,
						forceCount: true,
						forceSign: true,
						other: e.playerId !== currentPlayerId,
					},
				])
			}

			case EventType.CardResourceChanged: {
				// TODO: What if the card index is different?
				return [
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
				]
			}

			case EventType.CardsReceived: {
				return [
					...playerSymbol(e.playerId),
					{
						symbol: SymbolType.Card,
						count: e.amount,
						other: e.playerId !== currentPlayerId,
					},
				]
			}

			case EventType.GameProgressChanged: {
				if (e.progress === 'temperature') {
					return [{ symbol: SymbolType.Temperature, count: e.amount }]
				}

				if (e.progress === 'oxygen') {
					return [{ symbol: SymbolType.Oxygen, count: e.amount }]
				}

				if (e.progress === 'oceans') {
					return [{ tile: GridCellContent.Ocean, count: e.amount }]
				}

				if (e.progress === 'venus') {
					return [{ symbol: SymbolType.Venus, count: e.amount }]
				}

				return []
			}

			case EventType.RatingChanged: {
				return [
					...playerSymbol(e.playerId),
					{
						symbol: SymbolType.TerraformingRating,
						count: e.amount,
						forceCount: true,
						forceSign: true,
					},
				]
			}

			case EventType.PlayerTradeFleetsChange: {
				return [
					...playerSymbol(e.playerId),
					{ symbol: SymbolType.TradeFleet, count: e.amount },
				]
			}

			case EventType.ProductionChanged: {
				return [
					...playerSymbol(e.playerId),
					{
						resource: e.resource,
						production: true,
						count: e.amount,
						forceCount: true,
						forceSign: true,
						other: e.playerId !== currentPlayerId,
					},
				]
			}

			case EventType.ColonyActivated: {
				// TODO: Symbol for this?
				return []
			}

			case EventType.TileAcquired: {
				return [
					...playerSymbol(e.playerId),
					{ tile: e.tile, tileOther: e.other },
				]
			}

			case EventType.TilePlaced: {
				return [
					...playerSymbol(e.playerId),
					{ tile: e.tile, tileOther: e.other },
				]
			}
		}

		return []
	}

	const allSymbols = useMemo(
		() => events.flatMap((e) => eventToSymbols(e)),
		[events],
	)

	return (
		<E style={{ maxWidth }}>
			{allSymbols.map((s, i) => (
				<SymbolContainer key={i} style={{ animationDelay: `${i * 200}ms` }}>
					<SymbolDisplay key={i} symbol={s} />
				</SymbolContainer>
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

const popIn = keyframes`
	0% { transform: scale(0); }
	100% { transform: scale(1); }
`

const SymbolContainer = styled.div`
	animation-name: ${popIn};
	animation-duration: 0.2s;
	animation-iteration-count: 1;
	animation-fill-mode: forwards;
	animation-timing-function: cubic-bezier(0.82, 0.19, 0.68, 1.43);
	transform: scale(0);
	display: flex;
	align-items: center;
`
