import { CommitteePartyIcon } from '@/components/CommitteePartyIcon'
import { Flex } from '@/components/Flex/Flex'
import { setGameHighlightedCell } from '@/store/modules/game'
import { useAppDispatch, useGameState } from '@/utils/hooks'
import { CardsLookupApi } from '@shared/cards'
import { Competitions } from '@shared/competitions'
import {
	GridCell,
	GridCellContent,
	PlayerState,
	VictoryPointsSource,
} from '@shared/index'
import { Milestones } from '@shared/milestones'
import { adjacentCells, allTiles } from '@shared/utils'
import { CardView } from '../../CardView/CardView'

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
			return <div>1 TR = 1VP: +{player.terraformRating} VP</div>
		}

		case VictoryPointsSource.Awards: {
			return (
				<div>
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
							<div key={type}>
								<div>
									{competition.title}: {index + 1} position +
									{game.competitionRewards[index]} VP
								</div>
							</div>
						)
					})}
				</div>
			)
		}

		case VictoryPointsSource.Milestones: {
			return (
				<div>
					{game.milestones
						.filter((m) => m.playerId === player.id)
						.map((m) => {
							const data = Milestones[m.type]

							return <div key={m.type}>{data.title}: +5 VP</div>
						})}
				</div>
			)
		}

		case VictoryPointsSource.Cards: {
			return (
				<Flex wrap="wrap">
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
			const forests = allTiles(game).ownedBy(player.id).hasGreenery().length

			return <div>1 Forest = 1 VP: +{forests} VP</div>
		}

		case VictoryPointsSource.Chairman: {
			return <div>Chairman</div>
		}

		case VictoryPointsSource.Cities: {
			// TODO: Change alpha of the parent modal

			const handleMouseOver = (cell: GridCell) => () => {
				dispatch(setGameHighlightedCell(cell))
				onOpacity(0.1)
			}

			const handleMouseOut = () => {
				dispatch(setGameHighlightedCell(undefined))
				onOpacity(1)
			}

			return (
				<div>
					{allTiles(game)
						.ownedBy(player.id)
						.hasCity()
						.map((cell) => {
							const adjacentForests = adjacentCells(
								game,
								cell.x,
								cell.y,
							).filter((c) => c.content === GridCellContent.Forest).length

							if (adjacentForests > 0) {
								return (
									<div
										key={`${cell.x}-${cell.y}`}
										onMouseOver={handleMouseOver(cell)}
										onMouseOut={handleMouseOut}
									>
										City at {cell.x}, {cell.y}: +{adjacentForests} VP for
										adjacent greeneries
									</div>
								)
							}
						})}
				</div>
			)
		}

		case VictoryPointsSource.PartyLeaders: {
			const leaderOfParties = game.committee.parties.filter(
				(p) => p.leader?.playerId?.id === player.id,
			)

			return (
				<Flex gap="0.25rem">
					Party leader of:
					{leaderOfParties.map((p) => (
						<CommitteePartyIcon key={p.code} party={p.code} />
					))}
					+{leaderOfParties.length} VP
				</Flex>
			)
		}

		default:
			return <></>
	}
}
