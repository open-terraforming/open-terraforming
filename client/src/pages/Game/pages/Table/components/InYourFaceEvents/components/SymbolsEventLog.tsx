import { useLocale } from '@/context/LocaleContext'
import { useAppStore, usePlayerState } from '@/utils/hooks'
import { CardResource, CardSymbol, Resource, SymbolType } from '@shared/cards'
import { EventType, GameEvent, GridCellContent } from '@shared/index'
import { groupBy } from '@shared/utils'
import { useMemo } from 'react'
import styled, { keyframes } from 'styled-components'
import { SymbolDisplay } from '../../CardView/components/SymbolDisplay'
import { Flex } from '@/components/Flex/Flex'
import { ClippedBox } from '@/components/ClippedBox'

type Props = {
	events: GameEvent[]
	currentPlayerId?: number
	currentUsedCardIndex?: number
	maxWidth?: string
	noSpacing?: boolean
	className?: string
}

type LogSymbol =
	| CardSymbol
	| {
			player: { id?: number; name: string; color: string }
			symbols: CardSymbol[]
	  }

export const SymbolsEventLog = ({
	events,
	currentPlayerId,
	currentUsedCardIndex,
	noSpacing,
	className,
	maxWidth = '15rem',
}: Props) => {
	const displayPlayer = usePlayerState()
	const players = useAppStore((state) => state.game.playerMap)
	const t = useLocale()

	const optionallyWithPlayer = (
		playerId: number | null,
		symbols: CardSymbol[],
	): LogSymbol[] =>
		playerId === currentPlayerId
			? symbols
			: [
					{
						player:
							playerId === null
								? { name: 'Neutral', color: '#ccc' }
								: players[playerId],
						symbols,
					},
				]

	const eventToSymbols = (event: GameEvent): CardSymbol[] => {
		switch (event.type) {
			case EventType.ResourcesChanged: {
				return Object.entries(event.resources).flatMap(([resource, amount]) => [
					{
						resource: resource as Resource,
						count: amount,
						forceCount: true,
						forceSign: true,
					},
				])
			}

			case EventType.CardResourceChanged: {
				// TODO: What if the card index is different?
				return [
					...(event.index !== currentUsedCardIndex
						? [{ text: t.cards[event.card], noRightSpacing: true }]
						: []),
					{
						cardResource: event.resource as CardResource,
						count: event.amount,
						forceCount: true,
						forceSign: true,
					},
				]
			}

			case EventType.CardsReceived: {
				return [
					{
						symbol: SymbolType.Card,
						count: event.amount,
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
					{
						symbol: SymbolType.TerraformingRating,
						count: event.amount,
						forceCount: true,
						forceSign: true,
					},
				]
			}

			case EventType.PlayerTradeFleetsChange: {
				return [{ symbol: SymbolType.TradeFleet, count: event.amount }]
			}

			case EventType.ProductionChanged: {
				return [
					{
						resource: event.resource,
						production: true,
						count: event.amount,
						forceCount: true,
						forceSign: true,
					},
				]
			}

			case EventType.ColonyActivated: {
				// TODO: Symbol for this?
				return []
			}

			case EventType.TileAcquired: {
				return [{ tile: event.tile, tileOther: event.other }]
			}

			case EventType.TilePlaced: {
				return [{ tile: event.tile, tileOther: event.other }]
			}

			case EventType.CommitteePartyDelegateChange: {
				return [
					{
						symbol: SymbolType.Delegate,
						forceCount: true,
						forceSign: true,
						count: event.change,
						color: !event.playerId ? '#ccc' : players[event.playerId].color,
						title: `${!event.playerId ? 'Neutral' : players[event.playerId].name} delegate`,
						noRightSpacing: true,
					},
					{ committeeParty: event.partyCode, noSpacing: true },
				]
			}

			case EventType.CommitteePartyLeaderChanged: {
				return [
					{
						symbol: SymbolType.PartyLeader,
						color: !event.playerId ? '#ccc' : players[event.playerId].color,
						title: `${!event.playerId ? 'Neutral' : players[event.playerId].name} is now party leader`,
						noRightSpacing: true,
					},
					{ committeeParty: event.partyCode, noSpacing: true },
				]
			}

			case EventType.CommitteeDominantPartyChanged: {
				return [
					{
						committeeParty: event.partyCode,
						title: `${t.committeeParties[event.partyCode]} is now dominant`,
						noRightSpacing: true,
						postfix: 'DOMINANT',
					},
				]
			}
		}

		return []
	}

	const allSymbols = useMemo(
		(): LogSymbol[] =>
			[
				...groupBy(events, (e) =>
					'playerId' in e ? e.playerId : -1,
				).entries(),
			].flatMap(([playerId, events]) => {
				if (playerId === -1) {
					return events.flatMap((e) => eventToSymbols(e))
				}

				return optionallyWithPlayer(
					playerId,
					events.flatMap((e) => eventToSymbols(e)),
				)
			}),
		[events, currentPlayerId],
	)

	return (
		<E
			style={{ maxWidth, ...(noSpacing && { margin: 0 }) }}
			className={className}
		>
			{allSymbols.flatMap((s, i) => (
				<SymbolContainer key={i} style={{ animationDelay: `${i * 300}ms` }}>
					{'player' in s ? (
						<PlayerContainer>
							<PlayerIcon>
								<SymbolDisplay
									symbol={{
										symbol: SymbolType.Player,
										color: s.player.color,
										title:
											displayPlayer.id === s.player.id ? 'You' : s.player.name,
									}}
								/>
							</PlayerIcon>
							<PlayerChanges>
								{s.symbols.map((s, i) => (
									<SymbolDisplay key={i} symbol={s} />
								))}
							</PlayerChanges>
						</PlayerContainer>
					) : (
						<SymbolDisplay symbol={s} />
					)}
				</SymbolContainer>
			))}
		</E>
	)
}

const PlayerContainer = styled(ClippedBox)`
	.inner {
		display: flex;
		align-items: stretch;
	}
`

const PlayerIcon = styled.div`
	background-color: ${({ theme }) => theme.colors.border};
	display: flex;
	align-items: center;
	padding: 0 0.5rem;
`

const PlayerChanges = styled(Flex)`
	padding: 0 0.25rem;
`

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
