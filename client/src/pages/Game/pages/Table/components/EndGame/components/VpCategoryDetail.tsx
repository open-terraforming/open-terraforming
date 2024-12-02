import { Tooltip } from '@/components'
import { CommitteePartyIcon } from '@/components/CommitteePartyIcon'
import { Flex } from '@/components/Flex/Flex'
import { useLocale } from '@/context/LocaleContext'
import { useGameState } from '@/utils/hooks'
import { CardsLookupApi } from '@shared/cards'
import { Competitions } from '@shared/competitions'
import { PlayerState, VictoryPointsSource } from '@shared/index'
import { Milestones } from '@shared/milestones'
import { CardView } from '../../CardView/CardView'

type Props = {
	player: PlayerState
	category: VictoryPointsSource
}

export const VpCategoryDetail = ({ player, category }: Props) => {
	const game = useGameState()
	const t = useLocale()

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
			return player.usedCards
				.map((state) => {
					const card = CardsLookupApi.get(state.code)

					return {
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
				.map(({ card, vp }) => (
					<div key={card.code}>
						<Tooltip
							position="bottom-left"
							content={
								<CardView
									card={card}
									evaluateMode={'viewing'}
									player={player}
								/>
							}
						>
							{t.cards[card.code]} - {vp}
						</Tooltip>
					</div>
				))
		}

		case VictoryPointsSource.Forests: {
			return <div>Forests</div>
		}

		case VictoryPointsSource.Chairman: {
			return <div>Chairman</div>
		}

		case VictoryPointsSource.Cities: {
			return <div>Cities</div>
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
