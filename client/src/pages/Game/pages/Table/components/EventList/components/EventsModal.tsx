import { Modal } from '@/components/Modal/Modal'
import React from 'react'
import { GameEvent } from '../types'
import { EventLine } from './EventLine'

type Props = {
	events: GameEvent[]
	onClose: () => void
}

export const EventsModal = ({ onClose, events }: Props) => {
	return (
		<Modal
			open={true}
			contentStyle={{ minWidth: '300px' }}
			onClose={onClose}
			header="Events"
		>
			{[...events].reverse().map((e, i) => (
				<EventLine key={i} event={e} animated={false} />
			))}
		</Modal>
	)
}
