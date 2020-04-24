import { Modal } from '@/components/Modal/Modal'
import { useApi } from '@/context/ApiContext'
import { cardsToCardList } from '@/utils/cards'
import { useAppStore } from '@/utils/hooks'
import { emptyCardState } from '@shared/cards/utils'
import { pickCorporation } from '@shared/index'
import React, { useMemo, useState } from 'react'
import { CardDisplay, CardInfo } from '../CardDisplay/CardDisplay'
import { PlayerActionType } from '@shared/player-actions'
import { HelpMessage } from '@/components/HelpMessage/HelpMessage'

export const CorporationPicker = () => {
	const api = useApi()
	const player = useAppStore(state => state.game.player)
	const pendingAction = useAppStore(state => state.game.pendingAction)

	const cards = useMemo(
		() =>
			pendingAction && pendingAction.type === PlayerActionType.PickCorporation
				? cardsToCardList(pendingAction.cards.map(p => emptyCardState(p)))
				: [],
		[player]
	)

	const [loading, setLoading] = useState(false)

	const handlePick = (c: CardInfo[]) => {
		const corp = c[0]

		if (!corp) {
			return
		}

		if (!loading) {
			setLoading(true)
			api.send(pickCorporation(corp.card.code))
		}
	}

	return (
		<Modal
			open={true}
			allowClose={false}
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
				message={
					'Corporation provides initial funds, production and effects which can help you during the game.'
				}
			/>
		</Modal>
	)
}
