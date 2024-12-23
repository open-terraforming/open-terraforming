import { setTableState } from '@/store/modules/table'
import { useAppDispatch, useAppStore } from '@/utils/hooks'
import { CardsLookupApi, CardType } from '@shared/cards'
import { isCardActionable } from '@shared/cards/utils'
import {
	CardDisplayModal,
	CardInfo,
} from '../CardDisplayModal/CardDisplayModal'

type Props = {
	onClose: () => void
	defaultType?: CardType
}

export const PlayedCards = ({ onClose, defaultType }: Props) => {
	const dispatch = useAppDispatch()
	const game = useAppStore((state) => state.game.state)
	const player = useAppStore((state) => state.game.player)
	const playing = useAppStore((state) => state.game.playing)

	const cards = useAppStore((state) => state.game.player?.usedCards)?.map(
		(c, i) =>
			({
				card: CardsLookupApi.get(c.code),
				state: c,
				index: i,
			}) as Required<CardInfo>,
	)

	const handleSelect = (cards: Required<CardInfo>[]) => {
		if (!playing) {
			return
		}

		const newlySelected = cards[cards.length - 1]

		if (newlySelected) {
			const card = newlySelected.card

			const playable =
				card &&
				player &&
				game &&
				isCardActionable(card, {
					card: newlySelected.state,
					player: player,
					game: game,
				})

			if (playable) {
				dispatch(
					setTableState({
						playingCardIndex: newlySelected.index,
					}),
				)

				onClose()
			}
		}
	}

	return (
		<CardDisplayModal
			cards={cards || []}
			onSelect={handleSelect}
			selected={[]}
			defaultType={defaultType}
			hideAdjustedPrice
			evaluateMode="playing"
			player={player}
			contentStyle={{ minWidth: '90%' }}
			onClose={onClose}
			header={'Cards on table'}
		/>
	)
}
