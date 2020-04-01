import { Button } from '@/components'
import { Card, CardCategory, CardType } from '@shared/cards'
import { UsedCardState } from '@shared/index'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { CardsContainer, NoCards } from '../CardsContainer/CardsContainer'
import { CardView } from '../CardView/CardView'
import { Tag } from '../CardView/components/Tag'
import { isNotUndefined } from '@/utils/collections'

export type CardInfo = {
	card: Card
	state?: UsedCardState
	index: number
}

export const CardDisplay = ({
	onSelect,
	selected,
	cards,
	filters = true,
	defaultType
}: {
	onSelect: (cards: CardInfo[]) => void
	cards: CardInfo[]
	selected: CardInfo[]
	defaultType?: CardType
	filters?: boolean
}) => {
	const [type, setType] = useState(defaultType)

	const [selectedCategories, setSelectedCategories] = useState(
		[] as CardCategory[]
	)

	const categories = useMemo(
		() =>
			[
				CardCategory.Building,
				CardCategory.Space,
				CardCategory.Power,
				CardCategory.Jupiter,
				CardCategory.Earth,
				CardCategory.City,
				CardCategory.Microbe,
				CardCategory.Plant,
				CardCategory.Animal,
				CardCategory.Event,
				CardCategory.Science
			].map(
				cat =>
					[
						cat,
						cards.filter(c => c.card.categories.includes(cat)).length
					] as const
			),
		[cards]
	)

	const types = useMemo(
		() =>
			[
				[CardType.Action, 'Playable actions'] as const,
				[CardType.Effect, 'Effects'] as const,
				[CardType.Building, 'Automated'] as const,
				[CardType.Event, 'Events'] as const,
				[undefined, 'All'] as const
			]
				.map(
					([c, title]) =>
						[
							c,
							title,
							cards.filter(ci => !c || ci.card.type === c).length
						] as const
				)
				.filter(([, , count]) => count > 0),
		[cards]
	)

	const filtered = useMemo(
		() => cards.filter(ci => !type || ci.card.type === type),
		[cards, type]
	)

	useEffect(() => {
		if (type && !types.find(([c]) => c === type)) {
			setType(types.length > 0 ? types[0][0] : undefined)
		}
	}, [type, types])

	useEffect(() => {
		if (selected.length > 0) {
			onSelect(
				selected
					.map(s => filtered.find(c => c.index === s.index))
					.filter(isNotUndefined)
			)
		}
	})

	return (
		<>
			{filters && (
				<Filters>
					<Types>
						{types.map(([cat, t, count]) => (
							<Button
								schema={cat === type ? 'primary' : 'transparent'}
								onClick={() => {
									setType(cat)
								}}
								key={cat}
							>
								{t} ({count})
							</Button>
						))}
					</Types>

					<Categories>
						{categories.map(([cat, count]) => (
							<Button
								schema={
									selectedCategories.includes(cat) ? 'primary' : 'transparent'
								}
								onClick={() => {
									setSelectedCategories(
										selectedCategories.includes(cat)
											? selectedCategories.filter(c => c !== cat)
											: [...selectedCategories, cat]
									)
								}}
								key={cat}
							>
								<Tag tag={cat} /> ({count})
							</Button>
						))}
					</Categories>
				</Filters>
			)}

			<CardsContainer>
				{filtered.length === 0 && <NoCards>No cards</NoCards>}
				{filtered.map(
					c =>
						c && (
							<CardView
								card={c.card}
								selected={selected.map(s => s.index).includes(c.index)}
								key={c.index}
								state={c.state}
								onClick={() => {
									onSelect(
										(selected.map(s => s.index).includes(c.index)
											? selected.filter(s => s.index !== c.index)
											: [...selected, c.index]
										)
											.map(i => cards.find(c => c.index === i))
											.filter(isNotUndefined)
									)
								}}
							/>
						)
				)}
			</CardsContainer>
		</>
	)
}

const Types = styled.div`
	display: flex;
	justify-content: center;
`

const Categories = styled.div`
	display: flex;
	justify-content: center;
`

const Filters = styled.div`
	display: flex;
	justify-content: center;
`
