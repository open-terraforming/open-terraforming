import { CardsLookupApi } from '@shared/cards'
import { Modal } from '@/components/Modal/Modal'
import { CardView } from '../../CardView/CardView'

type Props = {
	title?: string
	card: string
	onClose: () => void
	disablePortal?: boolean
}

export const CardModal = ({ card, onClose, title, disablePortal }: Props) => {
	const info = CardsLookupApi.get(card)

	return (
		<Modal
			open={true}
			header={title}
			onClose={onClose}
			disablePortal={disablePortal}
		>
			<CardView card={info} evaluate={false} hover={false} />
		</Modal>
	)
}
