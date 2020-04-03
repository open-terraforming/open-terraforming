import { Button } from '@/components'
import { Card, CardCategory, CardType } from '@shared/cards'
import { UsedCardState } from '@shared/index'
import React, { useEffect, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { NoCards } from '../CardsContainer/CardsContainer'
import { CardView } from '../CardView/CardView'
import { Tag } from '../CardView/components/Tag'
import { isNotUndefined } from '@/utils/collections'

export type CardInfo = {
	card: Card
	state?: UsedCardState
	index: number
}

export const CardDisplay = <T extends CardInfo>({
	onSelect,
	selected,
	cards,
	filters = true,
	defaultType
}: {
	onSelect: (cards: T[]) => void
	cards: T[]
	selected: T[]
	defaultType?: CardType
	filters?: boolean
}) => {
	const [type, setType] = useState(defaultType)

	const [selectedCategory, setSelectedCategory] = useState(
		undefined as CardCategory | undefined
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
			]
				.map(
					cat =>
						[
							cat,
							cards.filter(c => c.card.categories.includes(cat)).length
						] as const
				)
				.filter(([, count]) => count > 0),
		[cards]
	)

	const types = useMemo(
		() =>
			[
				[undefined, 'All'] as const,
				[CardType.Action, 'Playable'] as const,
				[CardType.Effect, 'Effects'] as const,
				[CardType.Building, 'Automated'] as const,
				[CardType.Event, 'Events'] as const
			]
				.map(
					([c, title]) =>
						[
							c,
							title,
							cards.filter(ci => c === undefined || ci.card.type === c).length
						] as const
				)
				.filter(([, , count]) => count > 0),
		[cards]
	)

	const filtered = useMemo(
		() =>
			cards.filter(
				ci =>
					(type === undefined || ci.card.type === type) &&
					(selectedCategory === undefined ||
						ci.card.categories.includes(selectedCategory))
			),
		[cards, type, selectedCategory]
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
							<FilterTag
								selected={cat === type}
								onClick={() => {
									setType(cat)
								}}
								key={cat}
							>
								<Type>{t}</Type>
								<Count>
									<div>{count}</div>
								</Count>
							</FilterTag>
						))}
					</Types>

					<Categories>
						{categories.map(([cat, count]) => (
							<FilterTag
								selected={selectedCategory === cat}
								onClick={() => {
									setSelectedCategory(
										selectedCategory === cat ? undefined : cat
									)
								}}
								key={cat}
							>
								<Tag tag={cat} />
								<Count>
									<div>{count}</div>
								</Count>
							</FilterTag>
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

const CardsContainer = styled.div`
	display: flex;
	overflow-x: scroll;
	justify-content: flex-start;
	min-width: 0;
	padding: 1rem 0;
`

const Types = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`

const Categories = styled.div`
	display: flex;
	justify-content: center;
	margin-left: auto;
`

const Filters = styled.div`
	display: flex;
	justify-content: center;
	margin-bottom: 1rem;
`

const FilterTag = styled.div<{ selected: boolean }>`
	margin: 0 0.2rem;
	padding: 0.2rem;
	position: relative;
	cursor: pointer;

	${props =>
		props.selected &&
		css`
			background: #44a8f2;
		`}
`

const Count = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	left: 0;
	right: 0;
	top: 25px;

	> div {
		border-radius: 3px;
		background: rgba(98, 98, 255, 0.8);
		padding: 0.25rem;
	}
`

const Type = styled.div`
	padding: 0.5rem 0;
	margin: 0 0.5rem;
`
