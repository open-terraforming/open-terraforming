import { Button } from '@/components'
import { Modal } from '@/components/Modal/Modal'
import { useApi } from '@/context/ApiContext'
import { useAppStore } from '@/utils/hooks'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import {
	CardCategory,
	CardEffectArgumentType,
	CardsLookupApi
} from '@shared/cards'
import { adjustedCardPrice } from '@shared/cards/utils'
import {
	buyCard,
	playCard,
	PlayerGameState,
	PlayerStateValue
} from '@shared/index'
import React, { useMemo, useState } from 'react'
import styled, { Keyframes, keyframes } from 'styled-components'
import { CardView } from '../CardView/CardView'
import { ResourceIcon } from '../ResourceIcon/ResourceIcon'
import { ArgsPicker } from './components/ArgsPicker'
import { ResourceInput } from './components/ResourceInput'

type Props = {
	index: number
	onClose: () => void
	buying: boolean
	forced?: boolean
}

export const CardBuy = ({ index, onClose, buying, forced }: Props) => {
	const api = useApi()
	const state = useAppStore(state => state.game.player)

	const cardState = useMemo(
		() => (!buying ? state?.usedCards[index] : undefined),
		[buying, index]
	)

	const card = CardsLookupApi.getOptional(
		buying
			? (state?.cards[index] as string)
			: (state?.usedCards[index].code as string)
	)

	const canUseOre =
		(state?.ore || 0) > 0 && card?.categories.includes(CardCategory.Building)

	const canUseTitan =
		(state?.titan || 0) > 0 && card?.categories.includes(CardCategory.Space)

	const maxOre =
		canUseOre && state && card
			? Math.min(state.ore, Math.ceil(card.cost / state.orePrice))
			: 0

	const maxTitan =
		canUseTitan && state && card
			? Math.min(state.titan || 0, Math.ceil(card.cost / state.titanPrice))
			: 0

	const [ore, setOre] = useState(maxOre)
	const [titan, setTitan] = useState(maxTitan)

	const [effectsArgs, setEffectsArgs] = useState(
		[] as CardEffectArgumentType[][]
	)

	const isPlaying = state?.state === PlayerStateValue.Playing

	const price = card
		? Math.max(
				0,
				adjustedCardPrice(card, state as PlayerGameState) -
					(canUseOre ? ore : 0) * (state?.orePrice || 2) -
					(canUseTitan ? titan : 0) * (state?.titanPrice || 3)
		  )
		: 0

	const canAfford = !buying || (state?.money || 0) >= price

	const handleUse = (close: (animation?: Keyframes) => void) => {
		if (!canAfford || !card) {
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

		close(cardBought)
	}

	return state && card ? (
		<Modal
			open={true}
			onClose={onClose}
			allowClose={!forced}
			footer={(_close, animate) => (
				<>
					<Button
						disabled={!canAfford || !isPlaying}
						onClick={canAfford ? () => handleUse(animate) : undefined}
					>
						{buying ? (
							<>
								Use card for {price}
								<ResourceIcon res="money" />
							</>
						) : forced ? (
							'Confirm'
						) : (
							'Use card'
						)}
					</Button>
					{!forced && (
						<Button schema="transparent" icon={faTimes} onClick={onClose}>
							Cancel
						</Button>
					)}
				</>
			)}
		>
			<CardContainer>
				<CardView
					card={card}
					state={cardState}
					cardIndex={index}
					hover={false}
				/>
			</CardContainer>

			{buying ? (
				<>
					{canUseOre && (
						<UseContainer>
							Use{' '}
							<ResourceInput
								max={maxOre}
								res={'ore'}
								initialValue={ore}
								onChange={v => {
									setOre(Math.min(v, maxOre))
								}}
							/>
						</UseContainer>
					)}

					{canUseTitan && (
						<UseContainer>
							Use{' '}
							<ResourceInput
								max={maxTitan}
								res={'titan'}
								initialValue={titan}
								onChange={v => {
									setTitan(Math.min(v, maxTitan))
								}}
							/>
						</UseContainer>
					)}

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

const cardBought = keyframes`
	0% { transform: scale(1, 1); opacity: 1 }
	100% { transform: scale(3, 3); opacity: 0; }
`

const UseContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;

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
