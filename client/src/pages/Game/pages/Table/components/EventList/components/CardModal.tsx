import { CardsLookupApi } from '@shared/cards'
import { Modal } from '@/components/Modal/Modal'
import { CardView } from '../../CardView/CardView'
import { usePlayerState } from '@/utils/hooks'

type Props = {
	title?: string
	card: string
	onClose: () => void
	disablePortal?: boolean
}

export const CardModal = ({ card, onClose, title, disablePortal }: Props) => {
	const info = CardsLookupApi.get(card)
	const player = usePlayerState()

	return (
		<Modal
			open={true}
			header={title}
			onClose={onClose}
			disablePortal={disablePortal}
		>
			<CardView
				card={info}
				evaluateMode="static"
				player={player}
				hover={false}
			/>
		</Modal>
	)
}
