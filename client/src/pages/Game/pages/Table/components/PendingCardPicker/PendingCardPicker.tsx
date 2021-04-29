import { useApi } from '@/context/ApiContext'
import { draftCard, pickCards, pickPreludes } from '@shared/index'
import { PlayerAction, PlayerActionType } from '@shared/player-actions'
import React, { useMemo, useState } from 'react'
import { CardPicker, PickerType } from '../CardPicker/CardPicker'

type Props = {
	action: PlayerAction
	closeable?: boolean
	onClose?: () => void
}

export const PendingCardPicker = ({ action, closeable, onClose }: Props) => {
	const api = useApi()

	if (
		action.type !== PlayerActionType.PickCards &&
		action.type !== PlayerActionType.PickPreludes &&
		action.type !== PlayerActionType.DraftCard
	) {
		throw new Error('Not card picker')
	}

	const isFree =
		action.type === PlayerActionType.PickPreludes ||
		action.type === PlayerActionType.DraftCard ||
		action.free

	const [loading, setLoading] = useState(false)

	const pickerType = useMemo(() => {
		switch (action.type) {
			case PlayerActionType.PickCards: {
				return PickerType.Cards
			}

			case PlayerActionType.PickPreludes: {
				return PickerType.Preludes
			}

			case PlayerActionType.DraftCard: {
				return PickerType.Draft
			}
		}
	}, [action.type])

	const handleConfirm = (selected: number[]) => {
		setLoading(true)

		switch (action.type) {
			case PlayerActionType.PickCards: {
				return api.send(pickCards(selected))
			}

			case PlayerActionType.PickPreludes: {
				return api.send(pickPreludes(selected))
			}

			case PlayerActionType.DraftCard: {
				return api.send(draftCard(selected))
			}
		}
	}

	return (
		<CardPicker
			cards={action.cards}
			type={pickerType}
			loading={loading}
			onSelect={handleConfirm}
			onClose={onClose}
			closeable={closeable}
			free={isFree}
			limit={action.limit}
		/>
	)
}
