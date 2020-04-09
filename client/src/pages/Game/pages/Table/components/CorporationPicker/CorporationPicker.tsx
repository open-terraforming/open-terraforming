import { Modal } from '@/components/Modal/Modal'
import { useApi } from '@/context/ApiContext'
import { cardsToCardList } from '@/utils/cards'
import { useAppStore } from '@/utils/hooks'
import { emptyCardState } from '@shared/cards/utils'
import { pickCorporation } from '@shared/index'
import React, { useMemo, useState } from 'react'
import { CardDisplay, CardInfo } from '../CardDisplay/CardDisplay'

export const CorporationPicker = () => {
	const api = useApi()
	const player = useAppStore(state => state.game.player)

	const cards = useMemo(
		() =>
			player
				? cardsToCardList(player.cardsPick.map(p => emptyCardState(p)))
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
		<Modal open={true} allowClose={false} header={'Pick corporation'}>
			<CardDisplay
				cards={cards}
				filters={false}
				evaluate={false}
				onSelect={handlePick}
				selected={[]}
			/>
		</Modal>
	)
}
