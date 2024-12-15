import { Button } from '@/components'
import { Modal } from '@/components/Modal/Modal'
import { useApi } from '@/context/ApiContext'
import {
	useAppDispatch,
	useAppStore,
	useGameState,
	usePlayerState,
} from '@/utils/hooks'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import {
	AnyCardEffectArgument,
	CardCategory,
	CardEffectArgumentType,
	CardEffectArgumentValue,
	CardsLookupApi,
} from '@shared/cards'
import { adjustedCardPrice, emptyCardState } from '@shared/cards/utils'
import {
	buyCard,
	playCard,
	PlayerGameState,
	PlayerStateValue,
} from '@shared/index'
import { canPlaceAnywhere } from '@shared/placements'
import { useEffect, useMemo, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { CardView } from '../CardView/CardView'
import { ResourceIcon } from '../ResourceIcon/ResourceIcon'
import { ArgsPicker } from './components/ArgsPicker'
import { CardResourceInput } from './components/CardResourceInput'
import { ResourceInput } from './components/ResourceInput'
import { setTableState } from '@/store/modules/table'

type Props = {
	index: number
	onClose: () => void
	buying: boolean
	forced?: boolean
	hidden?: boolean
}

type Keyframes = ReturnType<typeof keyframes>

export const CardBuy = ({ index, onClose, buying, forced, hidden }: Props) => {
	const api = useApi()
	const dispatch = useAppDispatch()
	const player = usePlayerState()
	const game = useGameState()
	const highlightedCells = useAppStore((state) => state.game.highlightedCells)

	const cardState = useMemo(
		() => (!buying ? player?.usedCards[index] : undefined),
		[buying, index],
	)

	const card = CardsLookupApi.getOptional(
		buying
			? (player?.cards[index] as string)
			: (player?.usedCards[index].code as string),
	)

	const adjustedPrice = card
		? adjustedCardPrice(card, player as PlayerGameState)
		: 0

	const canUseOre =
		(player?.ore || 0) > 0 && card?.categories.includes(CardCategory.Building)

	const canUseTitan =
		(player?.titan || 0) > 0 && card?.categories.includes(CardCategory.Space)

	const usableCards = player?.usedCards
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
		canUseTitan && player && card
			? Math.min(
					player.titan || 0,
					Math.ceil(adjustedPrice / player.titanPrice),
				)
			: 0

	const maxOre =
		canUseOre && player && card
			? Math.min(player.ore, Math.ceil(adjustedPrice / player.orePrice))
			: 0

	const bestTitan =
		canUseTitan && player && card
			? Math.min(
					player.titan || 0,
					Math.floor(adjustedPrice / player.titanPrice),
				)
			: 0

	const bestOre =
		canUseOre && player && card
			? Math.min(
					player.ore,
					Math.floor(
						(adjustedPrice - bestTitan * player.titanPrice) / player.orePrice,
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
		) as CardEffectArgumentValue[][],
	)

	const isPlaying = player?.state === PlayerStateValue.Playing

	const price = card
		? Math.max(
				0,
				adjustedPrice -
					(canUseOre ? ore : 0) * (player?.orePrice || 2) -
					(canUseTitan ? titan : 0) * (player?.titanPrice || 3) -
					Object.entries(resourceByCard).reduce((acc, [code, amount]) => {
						const info = usableCards.find((c) => c.card.code === code)
						const { resource, resourcesUsableAsMoney } = info?.data ?? {}

						if (!info || !resource || !resourcesUsableAsMoney) {
							return acc
						}

						return acc + amount * resourcesUsableAsMoney.amount
					}, 0),
			)
		: 0

	const canAfford = !buying || (player?.money || 0) >= price

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

	const argsValid = useMemo(() => {
		const effects = (buying ? card?.playEffects : card?.actionEffects) ?? []

		return effects.every((effect, effectIndex) =>
			(effect.args as AnyCardEffectArgument[]).every((arg, argIndex) => {
				const argValue = effectsArgs[effectIndex][argIndex]

				if (!arg.optional && !argValue) {
					return false
				}

				if (
					arg.type === CardEffectArgumentType.Tile &&
					arg.tilePlacementState
				) {
					const canPlace = canPlaceAnywhere(
						game,
						player,
						arg.tilePlacementState,
					)

					if (canPlace && !argValue) {
						return false
					}
				}

				return true
			}),
		)
	}, [effectsArgs])

	useEffect(() => {
		return () => {
			dispatch(
				setTableState({
					currentlySelectedTiles: [],
				}),
			)
		}
	}, [])

	return player && card ? (
		<Modal
			open={true}
			onClose={onClose}
			allowClose={!forced}
			backgroundStyle={{
				...(hidden && { visibility: 'hidden', pointerEvents: 'none' }),
				...(highlightedCells.length && { opacity: 0.1 }),
			}}
			footer={(_close, animate) => (
				<>
					<Button
						disabled={!canAfford || !isPlaying || !argsValid}
						onClick={canAfford ? () => handleUse(animate) : undefined}
					>
						{buying ? (
							<>
								Realize project for {price}
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
				<CardView
					card={card}
					state={cardState}
					hover={false}
					evaluateMode="buying"
					player={player}
				/>
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
								as {ore * player.orePrice} <ResourceIcon res={'money'} />
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
								as {titan * player.titanPrice} <ResourceIcon res={'money'} />
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
							handCardIndex={index}
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
