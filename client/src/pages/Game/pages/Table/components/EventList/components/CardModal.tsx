import React from 'react'
import { CardsLookupApi } from '@shared/cards'
import { Modal } from '@/components/Modal/Modal'
import { CardView } from '../../CardView/CardView'

type Props = {
	title?: string
	card: string
	onClose: () => void
}

export const CardModal = ({ card, onClose, title }: Props) => {
	const info = CardsLookupApi.get(card)

	return (
		<Modal open={true} header={title} onClose={onClose}>
			<CardView card={info} evaluate={false} hover={false} />
		</Modal>
	)
}
