import { setTableState } from '@/store/modules/table'
import { useAppDispatch, useAppStore } from '@/utils/hooks'
import { CardsLookupApi } from '@shared/cards'
import {
	emptyCardState,
	isCardPlayable,
	minimalCardPrice,
} from '@shared/cards/utils'
import { CardDisplayModal } from '../CardDisplayModal/CardDisplayModal'

export const Hand = ({
	onClose,
	playing,
}: {
	onClose: () => void
	playing: boolean
}) => {
	const dispatch = useAppDispatch()
	const player = useAppStore((state) => state.game.player)
	const game = useAppStore((state) => state.game.state)
	const state = player

	const cards =
		useAppStore((state) => state.game.player?.cards)?.map((c) =>
			CardsLookupApi.get(c),
		) || []

	const handleSelect = (index: number | undefined) => {
		if (!playing) {
			return
		}

		if (index !== undefined && cards && state && player && game) {
			const card = cards[index]

			const adjusted = minimalCardPrice(card, state)

			const playable =
				card &&
				isCardPlayable(card, {
					card: emptyCardState(card.code),
					player: player,
					game: game,
				})

			if (adjusted > state.money || !playable) {
				return
			}

			dispatch(
				setTableState({
					buyingCardIndex: index,
				}),
			)

			onClose()
		}
	}

	return (
		<CardDisplayModal
			onClose={onClose}
			header={'Cards in your hand'}
			contentStyle={{ minWidth: '80%' }}
			bodyStyle={{ display: 'flex', flexDirection: 'column', padding: 0 }}
			player={player}
			evaluateMode="buying"
			onSelect={(c) => {
				handleSelect(c.length > 0 ? c[c.length - 1].index : undefined)
			}}
			selected={[]}
			cards={cards.map((c, i) => ({ card: c, index: i }))}
		/>
	)
}
