import { HelpMessage } from '@/components/HelpMessage/HelpMessage'
import { Modal } from '@/components/Modal/Modal'
import { cardsToCardList } from '@/utils/cards'
import { emptyCardState } from '@shared/cards/utils'
import React, { useMemo } from 'react'
import { CardDisplay, CardInfo } from '../CardDisplay/CardDisplay'

interface Props {
	corporations: string[]
	onSelect: (corporation: string) => void
	onClose: () => void
}

export const CorporationPicker = ({
	corporations,
	onSelect,
	onClose
}: Props) => {
	const cards = useMemo(
		() => cardsToCardList(corporations.map(p => emptyCardState(p))),
		[corporations]
	)

	const handlePick = (c: CardInfo[]) => {
		const corp = c[0]

		if (!corp) {
			return
		}

		onSelect(corp.card.code)
	}

	return (
		<Modal
			open={true}
			allowClose={true}
			onClose={onClose}
			headerStyle={{ justifyContent: 'center' }}
			header={'Pick your corporation'}
		>
			<CardDisplay
				cards={cards}
				filters={false}
				evaluate={false}
				onSelect={handlePick}
				selected={[]}
			/>

			<HelpMessage
				id="corporation-picker-message"
				message={
					'Corporation provides initial funds, production and effects which can help you during the game.'
				}
			/>
		</Modal>
	)
}
