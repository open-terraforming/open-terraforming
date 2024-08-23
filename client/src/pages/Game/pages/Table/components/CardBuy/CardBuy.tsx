import { Button } from '@/components'
import { Modal } from '@/components/Modal/Modal'
import { useApi } from '@/context/ApiContext'
import { useAppStore } from '@/utils/hooks'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import {
	CardCategory,
	CardEffectArgumentType,
	CardsLookupApi,
} from '@shared/cards'
import { adjustedCardPrice, emptyCardState } from '@shared/cards/utils'
import {
	buyCard,
	playCard,
	PlayerGameState,
	PlayerStateValue,
} from '@shared/index'
import { useMemo, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { CardView } from '../CardView/CardView'
import { ResourceIcon } from '../ResourceIcon/ResourceIcon'
import { ArgsPicker } from './components/ArgsPicker'
import { ResourceInput } from './components/ResourceInput'
import { CardResourceInput } from './components/CardResourceInput'

type Props = {
	index: number
	onClose: () => void
	buying: boolean
	forced?: boolean
}

type Keyframes = ReturnType<typeof keyframes>

export const CardBuy = ({ index, onClose, buying, forced }: Props) => {
	const api = useApi()
	const state = useAppStore((state) => state.game.player)

	const cardState = useMemo(
		() => (!buying ? state?.usedCards[index] : undefined),
		[buying, index],
	)

	const card = CardsLookupApi.getOptional(
		buying
			? (state?.cards[index] as string)
			: (state?.usedCards[index].code as string),
	)

	const adjustedPrice = card
		? adjustedCardPrice(card, state as PlayerGameState)
		: 0

	const canUseOre =
		(state?.ore || 0) > 0 && card?.categories.includes(CardCategory.Building)

	const canUseTitan =
		(state?.titan || 0) > 0 && card?.categories.includes(CardCategory.Space)

	const usableCards = state?.usedCards
		.filter((usedCard) => {
			const data = CardsLookupApi.get(usedCard.code)

			return (
				data.resourcesUsableAsMoney &&
				(!data.resourcesUsableAsMoney.categories ||
					data.resourcesUsableAsMoney.categories.some((cat) =>
						card?.categories.includes(cat),
					))
			)
		})
		.map((card) => ({
			card,
			data: CardsLookupApi.get(card.code),
		}))

	const maxTitan =
		canUseTitan && state && card
			? Math.min(state.titan || 0, Math.ceil(adjustedPrice / state.titanPrice))
			: 0

	const maxOre =
		canUseOre && state && card
			? Math.min(state.ore, Math.ceil(adjustedPrice / state.orePrice))
			: 0

	const bestTitan =
		canUseTitan && state && card
			? Math.min(state.titan || 0, Math.floor(adjustedPrice / state.titanPrice))
			: 0

	const bestOre =
		canUseOre && state && card
			? Math.min(
					state.ore,
					Math.floor(
						(adjustedPrice - bestTitan * state.titanPrice) / state.orePrice,
					),
				)
			: 0

	const [ore, setOre] = useState(bestOre)
	const [titan, setTitan] = useState(bestTitan)

	const [resourceByCard, setResourceByCard] = useState(
		{} as Record<string, number>,
	)

	const [effectsArgs, setEffectsArgs] = useState(
		((buying ? card?.playEffects : card?.actionEffects) ?? []).map(
			() => [],
		) as CardEffectArgumentType[][],
	)

	const isPlaying = state?.state === PlayerStateValue.Playing

	const price = card
		? Math.max(
				0,
				adjustedPrice -
					(canUseOre ? ore : 0) * (state?.orePrice || 2) -
					(canUseTitan ? titan : 0) * (state?.titanPrice || 3) -
					Object.entries(resourceByCard).reduce((acc, [code, amount]) => {
						const info = usableCards.find((c) => c.card.code === code)
						const { resource, resourcesUsableAsMoney } = info?.data ?? {}

						if (!info || !resource || !resourcesUsableAsMoney) {
							return acc
						}

						return (
							acc + amount * info.card[resource] * resourcesUsableAsMoney.amount
						)
					}, 0),
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
						resourceByCard,
						effectsArgs.map((a) => a || []),
					)
				: playCard(
						card.code,
						index,
						effectsArgs.map((a) => a || []),
					),
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
								Realise project for {price}
								<ResourceIcon res="money" />
							</>
						) : forced ? (
							'Confirm'
						) : (
							'Play action'
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
				<CardView card={card} state={cardState} hover={false} />
			</CardContainer>

			{buying ? (
				<>
					{canUseOre && (
						<UseContainer>
							<span>Use</span>
							<ResourceInput
								max={maxOre}
								res={'ore'}
								initialValue={ore}
								onChange={(v) => {
									setOre(Math.min(v, maxOre))
								}}
							/>
							<span>
								as {ore * state.orePrice} <ResourceIcon res={'money'} />
							</span>
						</UseContainer>
					)}

					{canUseTitan && (
						<UseContainer>
							<span>Use</span>
							<ResourceInput
								max={maxTitan}
								res={'titan'}
								initialValue={titan}
								onChange={(v) => {
									setTitan(Math.min(v, maxTitan))
								}}
							/>
							<span>
								as {titan * state.titanPrice} <ResourceIcon res={'money'} />
							</span>
						</UseContainer>
					)}

					{usableCards.map(({ card, data }, i) => (
						<UseContainer key={i}>
							<span>Use from {card.code}</span>
							<CardResourceInput
								max={card[data.resource ?? 'animals']}
								res={data.resource ?? 'animals'}
								initialValue={resourceByCard[card.code] ?? 0}
								onChange={(v) => {
									setResourceByCard((prev) => ({
										...prev,
										[card.code]: v,
									}))
								}}
							/>
							<span>
								as {data.resourcesUsableAsMoney?.amount ?? 1}{' '}
								<ResourceIcon res={'money'} />
							</span>
						</UseContainer>
					))}

					{card.playEffects.map((e, i) => (
						<ArgsPicker
							key={i}
							effect={e}
							card={card.code}
							cardState={cardState || emptyCardState(card.code)}
							onChange={(v) => {
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
							cardState={cardState || emptyCardState(card.code)}
							onChange={(v) => {
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
	margin-bottom: 1rem;

	> span {
		margin-right: 0.5rem;
	}
`

const CardContainer = styled.div`
	display: flex;
	justify-content: center;
	margin-bottom: 1rem;
`
