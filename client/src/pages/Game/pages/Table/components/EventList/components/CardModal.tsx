import React from 'react'
import { CardsLookupApi } from '@shared/cards'
import { Modal } from '@/components/Modal/Modal'
import { CardView } from '../../CardView/CardView'
import { Button } from '@/components'

type Props = {
	card: string
	onClose: () => void
}

export const CardModal = ({ card, onClose }: Props) => {
	const info = CardsLookupApi.get(card)

	return (
		<Modal
			open={true}
			onClose={onClose}
			footer={<Button onClick={onClose}>Close</Button>}
		>
			<CardView card={info} />
		</Modal>
	)
}
