import { HelpMessage } from '@/components/HelpMessage/HelpMessage'
import { cardsToCardList } from '@/utils/cards'
import { EMPTY_PLAYER } from '@/utils/constants'
import { emptyCardState } from '@shared/cards/utils'
import { useMemo } from 'react'
import {
	CardDisplayModal,
	CardInfo,
} from '../CardDisplayModal/CardDisplayModal'

interface Props {
	corporations: string[]
	onSelect: (corporation: string) => void
	onClose: () => void
}

export const CorporationPicker = ({
	corporations,
	onSelect,
	onClose,
}: Props) => {
	const cards = useMemo(
		() => cardsToCardList(corporations.map((p) => emptyCardState(p))),
		[corporations],
	)

	const handlePick = (c: CardInfo[]) => {
		const corp = c[0]

		if (!corp) {
			return
		}

		onSelect(corp.card.code)
	}

	return (
		<CardDisplayModal
			cards={cards}
			filters={false}
			onSelect={handlePick}
			selected={[]}
			evaluateMode="static"
			player={EMPTY_PLAYER}
			onClose={onClose}
			header={'Pick your corporation'}
			footer={
				<HelpMessage
					id="corporation-picker-message"
					message={
						'Corporation provides initial funds, production and effects which can help you during the game.'
					}
				/>
			}
		/>
	)
}
