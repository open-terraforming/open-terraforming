import { Competitions, CompetitionType } from '@shared/competitions'
import { COMPETITIONS_REWARDS } from '@shared/constants'
import { GameStateValue, PlayerState, VictoryPointsSource } from '@shared/index'
import { f } from '@shared/utils'
import { BaseGameState } from './base-game-state'

export class EndedGameState extends BaseGameState {
	name = GameStateValue.Ended

	onEnter() {
		this.logger.log(`Game finished`)

		this.state.ended = new Date().toISOString()

		this.game.players.forEach(p => {
			p.finishGame()
		})

		this.state.competitions.forEach(({ type }) => {
			const competition = Competitions[type]

			const score = this.state.players.reduce((acc, p) => {
				const s = competition.getScore(this.state, p)

				if (!acc[s]) {
					acc[s] = []
				}

				acc[s].push(p)

				return acc
			}, {} as Record<number, PlayerState[]>)

			Object.entries(score)
				.sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
				.slice(0, 2)
				.forEach(([, players], index) => {
					players.forEach(p => {
						this.logger.log(
							f(
								`Player {0} is {1}. at {2} competition`,
								p.name,
								index + 1,
								CompetitionType[type]
							)
						)

						p.victoryPoints.push({
							source: VictoryPointsSource.Awards,
							amount: COMPETITIONS_REWARDS[index],
							competition: type
						})
					})
				})
		})
	}
}
