import React, { useState, useMemo } from 'react'
import { Modal } from '@/components/Modal/Modal'
import { CardView } from '../CardView/CardView'
import {
	CardCategory,
	CardEffectArgumentType,
	CardsLookupApi
} from '@shared/cards'
import { useAppStore } from '@/utils/hooks'
import { Input } from '@/components/Input/Input'
import { Button } from '@/components'
import { buyCard, playCard } from '@shared/index'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { ArgsPicker } from './components/ArgsPicker'
import styled from 'styled-components'
import { useApi } from '@/context/ApiContext'
import { ResourceInput } from './components/ResourceInput'

type Props = {
	index: number
	onClose: () => void
	buying: boolean
}

export const CardBuy = ({ index, onClose, buying }: Props) => {
	const api = useApi()
	const state = useAppStore(state => state.game.player?.gameState)

	const cardState = useMemo(
		() => (!buying ? state?.usedCards[index] : undefined),
		[buying, index]
	)

	const card = CardsLookupApi.get(
		buying
			? (state?.cards[index] as string)
			: (state?.usedCards[index].code as string)
	)

	const [ore, setOre] = useState(0)
	const [titan, setTitan] = useState(0)

	const [effectsArgs, setEffectsArgs] = useState(
		[] as CardEffectArgumentType[][]
	)

	const canUseOre =
		(state?.ore || 0) > 0 && card.categories.includes(CardCategory.Building)

	const canUseTitan =
		(state?.titan || 0) > 0 && card.categories.includes(CardCategory.Space)

	const price = Math.max(
		0,
		card.cost -
			(canUseOre ? ore : 0) * (state?.orePrice || 2) -
			(canUseTitan ? titan : 0) * (state?.titanPrice || 3)
	)

	const canAfford = !buying || (state?.money || 0) >= price

	const handleUse = () => {
		if (!canAfford) {
			return
		}

		api.send(
			buying
				? buyCard(
						card.code,
						index,
						canUseOre ? ore : 0,
						canUseTitan ? titan : 0,
						effectsArgs.map(a => a || [])
				  )
				: playCard(
						card.code,
						index,
						effectsArgs.map(a => a || [])
				  )
		)

		onClose()
	}

	return state ? (
		<Modal
			open={true}
			onClose={onClose}
			footer={
				<>
					<Button
						disabled={!canAfford}
						onClick={canAfford ? handleUse : undefined}
					>
						Use card
					</Button>
					<Button schema="transparent" icon={faTimes} onClick={onClose}>
						Cancel
					</Button>
				</>
			}
		>
			<CardContainer>
				<CardView card={card} state={cardState} cardIndex={index} />
			</CardContainer>

			{buying ? (
				<>
					{canUseOre && (
						<UseContainer>
							Use{' '}
							<ResourceInput
								max={state?.ore}
								res={'ore'}
								onChange={v => {
									setOre(Math.min(v, Math.ceil(card.cost / state.orePrice)))
								}}
							/>
						</UseContainer>
					)}

					{canUseTitan && (
						<UseContainer>
							Use{' '}
							<ResourceInput
								max={state?.titan}
								res={'titan'}
								onChange={v => {
									setTitan(Math.min(v, Math.ceil(card.cost / state.titanPrice)))
								}}
							/>
						</UseContainer>
					)}

					<div>Adjusted price: {price} $</div>

					{card.playEffects.map((e, i) => (
						<ArgsPicker
							key={i}
							effect={e}
							card={card.code}
							onChange={v => {
								const updated = [...effectsArgs]
								updated[i] = v
								setEffectsArgs(updated)
							}}
						/>
					))}
				</>
			) : (
				<>
					{card.actionEffects.map((e, i) => (
						<ArgsPicker
							key={i}
							effect={e}
							card={card.code}
							cardState={cardState}
							cardIndex={index}
							onChange={v => {
								const updated = [...effectsArgs]
								updated[i] = v
								setEffectsArgs(updated)
							}}
						/>
					))}
				</>
			)}
		</Modal>
	) : (
		<></>
	)
}

const UseContainer = styled.div`
	display: flex;
	align-items: center;

	input {
		margin: 0 0.5rem;
		width: 5rem;
	}
`

const CardContainer = styled.div`
	display: flex;
	justify-content: center;
	margin-bottom: 1rem;
`
