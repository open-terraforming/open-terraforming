import React from 'react'
import { Modal } from '@/components/Modal/Modal'
import { GameEvent } from '../types'
import { EventLine } from './EventLine'
import { PlayerState } from '@shared/index'

type Props = {
	events: GameEvent[]
	players: Record<number, PlayerState>
	onClose: () => void
}

export const EventsModal = ({ onClose, events, players }: Props) => {
	return (
		<Modal
			open={true}
			contentStyle={{ minWidth: '300px' }}
			onClose={onClose}
			header="Events"
		>
			{[...events].reverse().map((e, i) => (
				<EventLine key={i} event={e} players={players} animated={false} />
			))}
		</Modal>
	)
}
