import { useLocale } from '@/context/LocaleContext'
import { useAppStore } from '@/utils/hooks'
import { CardResource, CardSymbol, Resource, SymbolType } from '@shared/cards'
import { EventType, GameEvent, GridCellContent } from '@shared/index'
import { useMemo } from 'react'
import styled, { keyframes } from 'styled-components'
import { SymbolDisplay } from '../../CardView/components/SymbolDisplay'
import { Flex } from '@/components/Flex/Flex'

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

	const playerSymbol = (playerId: number | null): CardSymbol[] =>
		playerId === currentPlayerId
			? []
			: [
					{
						symbol: SymbolType.Player,
						color: playerId === null ? '#ccc' : players[playerId].color,
						title: playerId === null ? 'Neutral' : players[playerId].name,
						noRightSpacing: true,
					},
				]

	const eventToSymbols = (event: GameEvent): (CardSymbol[] | CardSymbol)[] => {
		switch (event.type) {
			case EventType.ResourcesChanged: {
				return Object.entries(event.resources).flatMap(([resource, amount]) => [
					...playerSymbol(event.playerId),
					{
						resource: resource as Resource,
						count: amount,
						forceCount: true,
						forceSign: true,
						other: event.playerId !== currentPlayerId,
					},
				])
			}

			case EventType.CardResourceChanged: {
				// TODO: What if the card index is different?
				return [
					...playerSymbol(event.playerId),
					...(event.index !== currentUsedCardIndex
						? [{ text: t.cards[event.card], noRightSpacing: true }]
						: []),
					{
						cardResource: event.resource as CardResource,
						count: event.amount,
						forceCount: true,
						forceSign: true,
						other: event.playerId !== currentPlayerId,
					},
				]
			}

			case EventType.CardsReceived: {
				return [
					...playerSymbol(event.playerId),
					{
						symbol: SymbolType.Card,
						count: event.amount,
						other: event.playerId !== currentPlayerId,
					},
				]
			}

			case EventType.GameProgressChanged: {
				if (event.progress === 'temperature') {
					return [{ symbol: SymbolType.Temperature, count: event.amount }]
				}

				if (event.progress === 'oxygen') {
					return [{ symbol: SymbolType.Oxygen, count: event.amount }]
				}

				if (event.progress === 'oceans') {
					return [{ tile: GridCellContent.Ocean, count: event.amount }]
				}

				if (event.progress === 'venus') {
					return [{ symbol: SymbolType.Venus, count: event.amount }]
				}

				return []
			}

			case EventType.RatingChanged: {
				return [
					...playerSymbol(event.playerId),
					{
						symbol: SymbolType.TerraformingRating,
						count: event.amount,
						forceCount: true,
						forceSign: true,
					},
				]
			}

			case EventType.PlayerTradeFleetsChange: {
				return [
					...playerSymbol(event.playerId),
					{ symbol: SymbolType.TradeFleet, count: event.amount },
				]
			}

			case EventType.ProductionChanged: {
				return [
					...playerSymbol(event.playerId),
					{
						resource: event.resource,
						production: true,
						count: event.amount,
						forceCount: true,
						forceSign: true,
						other: event.playerId !== currentPlayerId,
					},
				]
			}

			case EventType.ColonyActivated: {
				// TODO: Symbol for this?
				return []
			}

			case EventType.TileAcquired: {
				return [
					...playerSymbol(event.playerId),
					{ tile: event.tile, tileOther: event.other },
				]
			}

			case EventType.TilePlaced: {
				return [
					...playerSymbol(event.playerId),
					{ tile: event.tile, tileOther: event.other },
				]
			}

			case EventType.CommitteePartyDelegateChange: {
				return [
					[
						...event.changes.map((c) => ({
							symbol: SymbolType.Delegate,
							forceCount: true,
							forceSign: true,
							count: c.change,
							color: !c.playerId?.id ? '#ccc' : players[c.playerId?.id].color,
							title: `${!c.playerId?.id ? 'Neutral' : players[c.playerId?.id].name} delegate`,
							noRightSpacing: true,
						})),
						{ committeeParty: event.partyCode, noSpacing: true },
					],
				]
			}

			case EventType.CommitteePartyLeaderChanged: {
				return [
					[
						{
							symbol: SymbolType.PartyLeader,
							color: !event.playerId?.id
								? '#ccc'
								: players[event.playerId.id].color,
							title: `${!event.playerId?.id ? 'Neutral' : players[event.playerId.id].name} is now party leader`,
							noRightSpacing: true,
						},
						{ committeeParty: event.partyCode, noSpacing: true },
					],
				]
			}

			case EventType.CommitteeDominantPartyChanged: {
				return [
					[
						{
							committeeParty: event.partyCode,
							title: `${t.committeeParties[event.partyCode]} is now dominant`,
							noRightSpacing: true,
						},
						{
							text: 'DOMINANT',
							title: `${t.committeeParties[event.partyCode]} is now dominant`,
						},
					],
				]
			}

			// TODO: Committee symbols
		}

		return []
	}

	const allSymbols = useMemo(
		() => events.flatMap((e) => eventToSymbols(e)),
		[events],
	)

	return (
		<E style={{ maxWidth }}>
			{allSymbols.flatMap((s, i) => (
				<Flex>
					{(Array.isArray(s) ? s : [s]).map((s, ii) => (
						<SymbolContainer
							key={i + ii}
							style={{ animationDelay: `${i * 300}ms` }}
						>
							<SymbolDisplay symbol={s} />
						</SymbolContainer>
					))}
				</Flex>
			))}
		</E>
	)
}

const E = styled.div`
	display: flex;
	gap: 0.2rem;
	flex-wrap: wrap;
	justify-content: center;
	font-size: 125%;
	max-width: 15rem;
	margin: 1rem auto;
`

const popIn = keyframes`
	0% { transform: scale(0); opacity: 0; }
	100% { transform: scale(1); opacity: 1; }
`

const SymbolContainer = styled.div`
	animation-name: ${popIn};
	animation-duration: 0.2s;
	animation-iteration-count: 1;
	animation-fill-mode: forwards;
	animation-timing-function: cubic-bezier(0.82, 0.19, 0.7, 1.58);
	transform: scale(0);
	display: flex;
	align-items: center;
	flex-wrap: nowrap;
`
