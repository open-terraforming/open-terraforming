import { CommitteePartyIcon } from '@/components/CommitteePartyIcon'
import { Flex } from '@/components/Flex/Flex'
import { useLocale } from '@/context/LocaleContext'
import { useGameState } from '@/utils/hooks'
import { CardsLookupApi } from '@shared/cards'
import { PlayerState, VictoryPointsSource } from '@shared/index'
import { Milestones } from '@shared/milestones'

type Props = {
	player: PlayerState
	category: VictoryPointsSource
}

export const VpCategoryDetail = ({ player, category }: Props) => {
	const game = useGameState()
	const t = useLocale()

	switch (category) {
		case VictoryPointsSource.Rating: {
			return <div>Terraforming Rating</div>
		}

		case VictoryPointsSource.Awards: {
			return (
				<div>
					{game.milestones
						.filter((m) => m.playerId === player.id)
						.map((m) => {
							const data = Milestones[m.type]

							return <div key={m.type}>+5 {data.title}</div>
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

							return <div key={m.type}>+5 {data.title}</div>
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
						{t.cards[card.code]} - {vp}
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
			return (
				<Flex gap="0.25rem">
					Party leader of:
					{game.committee.parties
						.filter((p) => p.leader?.playerId?.id === player.id)
						.map((p) => (
							<CommitteePartyIcon key={p.code} party={p.code} />
						))}
				</Flex>
			)
		}

		default:
			return <></>
	}
}
