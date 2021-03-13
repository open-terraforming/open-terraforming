import { Button } from '@/components'
import { Modal } from '@/components/Modal/Modal'
import { useApi } from '@/context/ApiContext'
import { useAppStore } from '@/utils/hooks'
import { CardsLookupApi } from '@shared/cards'
import { pickCards, pickPreludes } from '@shared/index'
import { PlayerActionType } from '@shared/player-actions'
import React, { useMemo, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { CardsContainer } from '../CardsContainer/CardsContainer'
import { CardView } from '../CardView/CardView'
import { ResourceIcon } from '../ResourceIcon/ResourceIcon'
import { CardPickerHeader } from './components/CardPickerHeader'

type Props = {
	prelude?: boolean
	closeable?: boolean
	onClose?: () => void
}

export const CardPicker = ({ prelude, closeable, onClose }: Props) => {
	const api = useApi()
	const player = useAppStore(state => state.game.player)
	const game = useAppStore(state => state.game.state)
	const state = player

	const pendingAction = useAppStore(state => state.game.pendingAction)

	if (
		!pendingAction ||
		(pendingAction?.type !== PlayerActionType.PickCards &&
			pendingAction?.type !== PlayerActionType.PickPreludes)
	) {
		throw new Error('Not card picker')
	}

	const cardsToPick = useMemo(
		() => pendingAction.cards.map(c => CardsLookupApi.get(c)),
		[pendingAction.cards]
	)

	const cardsLimit = pendingAction.limit

	const isFree =
		pendingAction?.type === PlayerActionType.PickPreludes || pendingAction.free

	const [selected, setSelected] = useState([] as number[])
	const [loading, setLoading] = useState(false)

	const price = isFree ? 0 : selected.length * game.cardPrice
	const canAfford = state && price <= state.money

	const handleConfirm = () => {
		setLoading(true)

		if (prelude) {
			api.send(pickPreludes(selected))
		} else {
			api.send(pickCards(selected))
		}
	}

	if (!game || !player) {
		return <>No game / player</>
	}

	return (
		<Modal
			open={true}
			allowClose={closeable}
			onClose={onClose}
			headerStyle={{ justifyContent: 'center' }}
			header={
				<CardPickerHeader
					text={
						cardsLimit === 0 ? `Pick your cards` : `Pick ${cardsLimit} cards`
					}
				/>
			}
			footer={
				<Button
					onClick={handleConfirm}
					disabled={
						loading ||
						!canAfford ||
						(cardsLimit !== 0 && isFree && selected.length !== cardsLimit)
					}
					isLoading={loading}
				>
					{!isFree ? (
						selected.length > 0 ? (
							<>
								{`Buy ${selected.length} cards for ${price}`}
								<ResourceIcon res="money" />
							</>
						) : (
							'Buy nothing'
						)
					) : selected.length > 0 ? (
						`Select ${selected.length}`
					) : (
						'Select nothing'
					)}
				</Button>
			}
			bodyStyle={{ display: 'flex', flexDirection: 'column' }}
		>
			<CardsContainer style={{ flex: 1 }}>
				{cardsToPick?.map(
					(c, i) =>
						c && (
							<PopInContainer
								key={i}
								style={{
									animationDelay: `${i * 200}ms`
								}}
							>
								<CardView
									card={c}
									selected={selected.includes(i)}
									fade={false}
									onClick={
										!loading
											? () => {
													setSelected(
														selected.includes(i)
															? selected.filter(s => s !== i)
															: cardsLimit === 0 || selected.length < cardsLimit
															? [...selected, i]
															: selected
													)
											  }
											: undefined
									}
								/>
							</PopInContainer>
						)
				)}
			</CardsContainer>
		</Modal>
	)
}

const PopIn = keyframes`
	0% { transform: scale(1.1); opacity: 0; }
	100% { transform: scale(1); opacity: 1; }
`

const PopInContainer = styled.div`
	animation-name: ${PopIn};
	animation-duration: 300ms;
	animation-fill-mode: forwards;
	opacity: 0;
`
