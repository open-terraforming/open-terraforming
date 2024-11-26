import { CardsLookupApi } from './cards'
import { Competitions } from './competitions'
import {
	GameState,
	GridCellContent,
	PlayerState,
	VictoryPoints,
	VictoryPointsSource,
} from './gameState'
import { allCells } from './utils/allCells'
import { adjacentCells } from './utils/adjacentCells'

export const getCardVictoryPoints = (game: GameState, player: PlayerState) => {
	return player.usedCards.reduce((acc, state) => {
		const card = CardsLookupApi.get(state.code)
		acc += card.victoryPoints

		if (card.victoryPointsCallback) {
			acc += card.victoryPointsCallback.compute({
				card: state,
				game: game,
				player: player,
			})
		}

		return acc
	}, 0)
}

export const getTilesVictoryPoints = (game: GameState, player: PlayerState) => {
	return allCells(game).reduce(
		(acc, cell) => {
			if (cell.ownerId === player.id) {
				switch (cell.content) {
					case GridCellContent.Forest: {
						acc.forests += 1
						break
					}

					case GridCellContent.City: {
						acc.cities += adjacentCells(game, cell.x, cell.y).filter(
							(c) => c.content === GridCellContent.Forest,
						).length

						break
					}
				}
			}

			return acc
		},
		{ forests: 0, cities: 0 },
	)
}

export const getVictoryPoints = (
	game: GameState,
	player: PlayerState,
	competitions = true,
) => {
	const victoryPoints = [] as VictoryPoints[]

	victoryPoints.push({
		source: VictoryPointsSource.Rating,
		amount: player.terraformRating,
	})

	game.milestones
		.filter((m) => m.playerId === player.id)
		.forEach((m) => {
			victoryPoints.push({
				source: VictoryPointsSource.Milestones,
				amount: game.milestoneReward,
				milestone: m.type,
			})
		})

	if (competitions) {
		game.competitions.forEach(({ type }) => {
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

			Object.entries(score)
				.sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
				.slice(0, game.competitionRewards.length)
				.forEach(([, players], index) => {
					players.forEach((p) => {
						if (p.id === player.id) {
							victoryPoints.push({
								source: VictoryPointsSource.Awards,
								amount: game.competitionRewards[index],
								competition: type,
							})
						}
					})
				})
		})
	}

	victoryPoints.push({
		source: VictoryPointsSource.Cards,
		amount: getCardVictoryPoints(game, player),
	})

	const tileVps = getTilesVictoryPoints(game, player)

	victoryPoints.push({
		source: VictoryPointsSource.Forests,
		amount: tileVps.forests,
	})

	victoryPoints.push({
		source: VictoryPointsSource.Cities,
		amount: tileVps.cities,
	})

	if (game.committee.enabled) {
		victoryPoints.push({
			source: VictoryPointsSource.PartyLeaders,
			amount: game.committee.parties.reduce(
				(acc, party) =>
					acc + (party.leader?.playerId?.id === player.id ? 1 : 0),
				0,
			),
		})

		victoryPoints.push({
			source: VictoryPointsSource.Chairman,
			amount: game.committee.chairman?.playerId?.id === player.id ? 1 : 0,
		})
	}

	return victoryPoints
}
