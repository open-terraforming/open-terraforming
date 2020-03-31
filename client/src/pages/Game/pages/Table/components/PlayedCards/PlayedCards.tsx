import React, { useState, useMemo, useEffect } from 'react'
import { Modal } from '@/components/Modal/Modal'
import { useAppStore, useAppDispatch } from '@/utils/hooks'
import { CardsLookupApi, Card, CardType } from '@shared/cards'
import { CardView } from '../CardView/CardView'
import { Button } from '@/components'
import { buyCard, UsedCardState } from '@shared/index'
import { CardsContainer, NoCards } from '../CardsContainer/CardsContainer'
import styled from 'styled-components'
import { useApi } from '@/context/ApiContext'
import { setTableState } from '@/store/modules/table'

type CardInfo = {
	card: Card
	state: UsedCardState
	index: number
}

export const PlayedCards = ({
	onClose,
	playing
}: {
	onClose: () => void
	playing: boolean
}) => {
	const api = useApi()
	const dispatch = useAppDispatch()
	const player = useAppStore(state => state.game.player)
	const state = player?.gameState

	const cards = useAppStore(
		state => state.game.player?.gameState.usedCards
	)?.map(
		(c, i) =>
			({
				card: CardsLookupApi.get(c.code),
				state: c,
				index: i
			} as CardInfo)
	)

	const [category, setCategory] = useState(
		CardType.Action as CardType | undefined
	)

	const [selected, setSelected] = useState(undefined as number | undefined)

	const filtered = useMemo(
		() =>
			cards?.reduce((acc, c) => {
				acc[c.card.type] = [...(acc[c.card.type] || []), c]

				return acc
			}, {} as Record<CardType, CardInfo[]>),
		[cards]
	)

	const categories = useMemo(
		() =>
			[
				[CardType.Action, 'Playable actions'] as const,
				[CardType.Effect, 'Effects'] as const,
				[CardType.Building, 'Buildable'] as const,
				[CardType.Event, 'Events'] as const
			].filter(([c]) => filtered && filtered[c] && filtered[c].length > 0),
		[filtered]
	)

	useEffect(() => {
		if (category && !categories.find(([c]) => c === category)) {
			setCategory(categories.length > 0 ? categories[0][0] : undefined)
		}
	}, [category, categories])

	const handleConfirm = () => {
		if (selected !== undefined) {
			dispatch(
				setTableState({
					playingCardIndex: selected
				})
			)
		}

		onClose()
	}

	return (
		<Modal
			open={true}
			contentStyle={{ maxWidth: '90%', width: 'auto' }}
			onClose={onClose}
			header={'Cards on table'}
			footer={
				!playing ? (
					<Button onClick={onClose}>Close</Button>
				) : (
					<Button onClick={handleConfirm}>
						{selected ? `Play card` : 'Close'}
					</Button>
				)
			}
		>
			{category === undefined && <NoCards>No cards</NoCards>}
			{filtered && category !== undefined && (
				<>
					<Categories>
						{categories.map(([c, t]) => (
							<Button
								schema={c === category ? 'primary' : 'transparent'}
								onClick={() => {
									setSelected(undefined)
									setCategory(c)
								}}
								key={c}
							>
								{t} ({filtered[c]?.length})
							</Button>
						))}
					</Categories>

					<CardsContainer>
						{filtered[category]?.length === 0 && <NoCards>No cards</NoCards>}
						{filtered[category]?.map(
							c =>
								c && (
									<CardView
										card={c.card}
										selected={selected === c.index}
										key={c.index}
										onClick={
											playing && category === CardType.Action && !c.state.played
												? () => {
														setSelected(
															selected === c.index ? undefined : c.index
														)
												  }
												: undefined
										}
									/>
								)
						)}
					</CardsContainer>
				</>
			)}
		</Modal>
	)
}

const Categories = styled.div`
	display: flex;
	justify-content: center;
`
