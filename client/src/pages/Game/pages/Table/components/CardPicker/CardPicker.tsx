import React, { useState } from 'react'
import { Modal } from '@/components/Modal/Modal'
import styled from 'styled-components'
import { useAppStore } from '@/utils/hooks'
import { CardsLookupApi } from '@shared/cards'
import { CARD_PRICE } from '@shared/constants'
import { CardView } from '../CardView/CardView'
import { Button } from '@/components'
import { pickCards } from '@shared/index'
import { CardsContainer } from '../CardsContainer/CardsContainer'
import { useApi } from '@/context/ApiContext'

export const CardPicker = () => {
	const api = useApi()
	const player = useAppStore(state => state.game.player)
	const state = player

	const cardsToPick = useAppStore(
		state => state.game.player?.cardsPick
	)?.map(c => CardsLookupApi.get(c))

	const [selected, setSelected] = useState([] as number[])

	const [loading, setLoading] = useState(false)

	const price = selected.length * CARD_PRICE
	const canAfford = state && price <= state.money

	const handleConfirm = () => {
		setLoading(true)
		api.send(pickCards(selected))
	}

	return (
		<Modal
			open={true}
			allowClose={false}
			header={'Pick cards'}
			footer={
				!canAfford ? (
					`You can't afford ${selected.length} cards for ${price}`
				) : (
					<Button
						onClick={handleConfirm}
						disabled={loading}
						isLoading={loading}
					>
						{selected.length > 0
							? `Buy ${selected.length} cards for ${price}`
							: 'Buy nothing'}
					</Button>
				)
			}
		>
			<CardsContainer>
				{cardsToPick?.map(
					(c, i) =>
						c && (
							<CardView
								card={c}
								selected={selected.includes(i)}
								key={i}
								evaluate={false}
								onClick={
									!loading
										? () => {
												setSelected(
													selected.includes(i)
														? selected.filter(s => s !== i)
														: [...selected, i]
												)
										  }
										: undefined
								}
							/>
						)
				)}
			</CardsContainer>
		</Modal>
	)
}
