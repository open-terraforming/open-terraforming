import { CommitteePartyIcon } from '@/components/CommitteePartyIcon'
import { Flex } from '@/components/Flex/Flex'
import { setGameHighlightedCells } from '@/store/modules/game'
import { useAppDispatch, useGameState } from '@/utils/hooks'
import { CardsLookupApi, SymbolType } from '@shared/cards'
import { Competitions } from '@shared/competitions'
import {
	GridCell,
	GridCellContent,
	PlayerState,
	VictoryPointsSource,
} from '@shared/index'
import { Milestones } from '@shared/milestones'
import { adjacentCells, allTiles, repeat } from '@shared/utils'
import { CardView } from '../../CardView/CardView'
import { TileIcon } from '../../TileIcon/TileIcon'
import { Symbols } from '../../CardView/components/Symbols'
import { MilestoneDisplay } from '../../MilestonesModal/components/MilestoneDisplay'
import { Box } from '@/components/Box'
import { CompetitionDisplay } from '../../CompetitionsModal/components/CompetitionDisplay'
import styled from 'styled-components'

type Props = {
	player: PlayerState
	category: VictoryPointsSource
	onOpacity: (opacity: number) => void
}

export const VpCategoryDetail = ({ player, category, onOpacity }: Props) => {
	const game = useGameState()
	const dispatch = useAppDispatch()
	/*const t = useLocale()*/

	switch (category) {
		case VictoryPointsSource.Rating: {
			return (
				<CenteredDisplay>
					1 TR = 1VP: +{player.terraformRating} VP
				</CenteredDisplay>
			)
		}

		case VictoryPointsSource.Awards: {
			return (
				<CenteredDisplay>
					{game.competitions.map(({ type }) => {
						const competition = Competitions[type]

						const score = game.players.reduce(
							(acc, p) => {
								const s = competition.getScore(game, p)

								if (!acc[s]) {
									acc[s] = []
								}

								acc[s].push(p)

								return acc
							},
							{} as Record<number, PlayerState[]>,
						)

						const index = Object.entries(score)
							.sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
							.findIndex(([, players]) =>
								players.some((p) => p.id === player.id),
							)

						if (index >= game.competitionRewards.length) {
							return <></>
						}

						return (
							<CompetitionDisplay
								key={type}
								competition={competition}
								playing={false}
								highlightPlayerId={player.id}
								sponsoredId={
									game.competitions.find((c) => c.type === type)?.playerId
								}
							/>
						)
					})}
				</CenteredDisplay>
			)
		}

		case VictoryPointsSource.Milestones: {
			return (
				<CenteredDisplay>
					{game.milestones
						.filter((m) => m.playerId === player.id)
						.map((m) => {
							const data = Milestones[m.type]

							return (
								<MilestoneDisplay
									key={m.type}
									playing={false}
									milestone={data}
									currentPlayerId={player.id}
									titleRight={<Box $mr={2}>+{game.milestoneReward} VP</Box>}
								/>
							)
						})}
				</CenteredDisplay>
			)
		}

		case VictoryPointsSource.Cards: {
			return (
				<Flex wrap="wrap" justify="center">
					{player.usedCards
						.map((state) => {
							const card = CardsLookupApi.get(state.code)

							return {
								state,
								card,
								vp:
									card.victoryPoints +
									(card.victoryPointsCallback?.compute({
										card: state,
										game: game,
										player: player,
									}) ?? 0),
							}
						}, 0)
						.filter(({ vp }) => vp > 0)
						.sort(({ vp: a }, { vp: b }) => b - a)
						.map(({ card, state }) => (
							<div key={card.code}>
								<CardView
									card={card}
									state={state}
									evaluateMode={'viewing'}
									player={player}
								/>
							</div>
						))}
				</Flex>
			)
		}

		case VictoryPointsSource.Forests: {
			const forests = allTiles(game).ownedBy(player.id).hasGreenery().asArray()

			const handleMouseOver = () => {
				dispatch(setGameHighlightedCells(forests))
				onOpacity(0.1)
			}

			const handleMouseOut = () => {
				dispatch(setGameHighlightedCells([]))
				onOpacity(1)
			}

			return (
				<div onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
					<Flex wrap="wrap" justify="center">
						{repeat(forests.length).map((i) => (
							<TileIcon size="2.5em" content={GridCellContent.Forest} key={i} />
						))}
					</Flex>
					<Symbols
						symbols={[
							{ tile: GridCellContent.Forest, count: forests.length },
							{ symbol: SymbolType.Equal },
							{ text: forests.length + ' VP' },
						]}
					/>
				</div>
			)
		}

		case VictoryPointsSource.Chairman: {
			return <CenteredDisplay>Chairman</CenteredDisplay>
		}

		case VictoryPointsSource.Cities: {
			// TODO: Change alpha of the parent modal

			const handleMouseOver = (cell: GridCell) => () => {
				const adjacentGreeneries = adjacentCells(game, cell.x, cell.y).filter(
					(c) => c.content === GridCellContent.Forest,
				)

				dispatch(setGameHighlightedCells([cell, ...adjacentGreeneries]))
				onOpacity(0.1)
			}

			const handleMouseOut = () => {
				dispatch(setGameHighlightedCells([]))
				onOpacity(1)
			}

			return (
				<CenteredDisplay>
					<Flex wrap="wrap" justify="center" gap="0.5rem">
						{allTiles(game)
							.ownedBy(player.id)
							.hasCity()
							.sortBy(
								(cell) =>
									-adjacentCells(game, cell.x, cell.y).filter(
										(c) => c.content === GridCellContent.Forest,
									).length,
							)
							.map((cell) => {
								const adjacentForests = adjacentCells(
									game,
									cell.x,
									cell.y,
								).filter((c) => c.content === GridCellContent.Forest).length

								if (adjacentForests > 0) {
									return (
										<Flex
											gap="0.5rem"
											key={`${cell.x}-${cell.y}`}
											onMouseOver={handleMouseOver(cell)}
											onMouseOut={handleMouseOut}
										>
											<TileIcon content={GridCellContent.City} size="3em" />+
											{adjacentForests} VP for adjacent{' '}
											<TileIcon content={GridCellContent.Forest} size="2em" />
										</Flex>
									)
								}
							})}
					</Flex>
				</CenteredDisplay>
			)
		}

		case VictoryPointsSource.PartyLeaders: {
			const leaderOfParties = game.committee.parties.filter(
				(p) => p.leader?.playerId?.id === player.id,
			)

			return (
				<CenteredDisplay>
					<Flex gap="0.25rem">
						Party leader of:
						{leaderOfParties.map((p) => (
							<CommitteePartyIcon key={p.code} party={p.code} />
						))}
						+{leaderOfParties.length} VP
					</Flex>
				</CenteredDisplay>
			)
		}

		default:
			return <></>
	}
}

const CenteredDisplay = styled.div`
	width: 20rem;
	margin: auto;
`
