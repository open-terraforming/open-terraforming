import { isNotUndefined, mapRight } from '@/utils/collections'
import { Card, CardCategory, CardType } from '@shared/cards'
import { PlayerState, UsedCardState } from '@shared/index'
import { useEffect, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { NoCards } from '../CardsContainer/CardsContainer'
import { CardView } from '../CardView/CardView'
import { Tag } from '../CardView/components/Tag'
import { Checkbox } from '@/components/Checkbox/Checkbox'
import { media } from '@/styles/media'
import { lighten } from 'polished'

export type CardInfo = {
	card: Card
	state?: UsedCardState
	index: number
}

type Props<T extends CardInfo> = {
	onSelect: (cards: T[]) => void
	cards: T[]
	selected: T[]
	defaultType?: CardType
	filters?: boolean
	buying?: boolean
	evaluate?: boolean
	hover?: boolean
	hideAdjustedPrice?: boolean
	player?: PlayerState
}

export const CardDisplay = <T extends CardInfo>({
	onSelect,
	selected,
	cards,
	filters = true,
	buying = false,
	evaluate = true,
	hover = true,
	defaultType,
	hideAdjustedPrice,
	player,
}: Props<T>) => {
	const [type, setType] = useState(defaultType)
	const [playable, setPlayable] = useState(false)

	const [selectedCategory, setSelectedCategory] = useState(
		undefined as CardCategory | undefined,
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
				CardCategory.Science,
				CardCategory.Venus,
			]
				.map((cat) => ({
					category: cat,
					cards: cards.filter(
						(c) =>
							(cat === CardCategory.Event || c.card.type !== CardType.Event) &&
							c.card.categories.includes(cat),
					).length,
				}))
				.filter(({ cards }) => cards > 0),
		[cards],
	)

	const types = useMemo(
		() =>
			[
				[undefined, 'All'] as const,
				[CardType.Action, 'With Action'] as const,
				[CardType.Effect, 'Effects'] as const,
				[CardType.Building, 'Automated'] as const,
				[CardType.Event, 'Events'] as const,
				[CardType.Corporation, 'Corporation'] as const,
			]
				.map(
					([c, title]) =>
						[
							c,
							title,
							cards.filter((ci) => c === undefined || ci.card.type === c)
								.length,
						] as const,
				)
				.filter(([, , count]) => count > 0),
		[cards],
	)

	const filtered = useMemo(
		() =>
			cards.filter(
				(ci) =>
					(type === undefined || ci.card.type === type) &&
					(selectedCategory === undefined ||
						((selectedCategory === CardCategory.Event ||
							ci.card.type !== CardType.Event) &&
							ci.card.categories.includes(selectedCategory))),
			),
		[cards, type, selectedCategory],
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
					.map((s) => filtered.find((c) => c.index === s.index))
					.filter(isNotUndefined),
			)
		}
	}, [type, selectedCategory])

	return (
		<>
			{filters && (
				<Filters>
					<Types>
						{types.map(([cat, t, count]) => (
							<FilterItem
								selected={cat === type}
								onClick={() => {
									setType(cat)
								}}
								key={cat === undefined ? -1 : cat}
							>
								<Type>{t}</Type>
								<Count>{count}</Count>
							</FilterItem>
						))}
					</Types>

					{evaluate && (
						<Checkbox
							checked={playable}
							onChange={(v) => setPlayable(v)}
							label="Only playable"
						/>
					)}

					<Categories style={{ maxWidth: '50%', overflow: 'auto' }}>
						{categories.map(({ category, cards }) => (
							<FilterTag
								selected={selectedCategory === category}
								onClick={() => {
									setSelectedCategory(
										selectedCategory === category ? undefined : category,
									)
								}}
								key={category}
							>
								<Type>
									<Tag tag={category} size="sm" />
								</Type>
								<Count>
									<div>{cards}</div>
								</Count>
							</FilterTag>
						))}
					</Categories>
				</Filters>
			)}

			<CardsContainer playableOnly={playable}>
				{filtered.length === 0 && <NoCards>No cards</NoCards>}
				{mapRight(
					filtered,
					(c) =>
						c && (
							<CardView
								hover={hover}
								evaluate={evaluate}
								buying={buying}
								hideAdjustedPrice={hideAdjustedPrice}
								card={c.card}
								selected={selected.map((s) => s.index).includes(c.index)}
								key={c.index}
								state={c.state}
								player={player}
								onClick={() => {
									onSelect(
										selected.find((s) => s.index === c.index)
											? selected.filter((s) => s.index !== c.index)
											: [...selected, c],
									)
								}}
							/>
						),
				)}
			</CardsContainer>
		</>
	)
}

const CardsContainer = styled.div<{ playableOnly: boolean }>`
	display: flex;
	overflow: auto;
	flex-wrap: wrap;
	justify-content: flex-start;
	align-items: center;
	min-width: 0;
	padding: 1.5rem 1rem;
	min-height: 322px;

	${media.medium} {
		min-height: 100px;
	}

	flex: 1;

	${(props) =>
		props.playableOnly &&
		css`
			.unplayable {
				display: none;
			}
		`}
`

const Types = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`

const Categories = styled.div`
	display: flex;
	justify-content: center;
`

const Filters = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1rem;
`

const Count = styled.div`
	padding: 0.35rem;
	background-color: ${({ theme }) => lighten(0.1, theme.colors.border)};

	display: flex;
	align-items: center;
	justify-content: center;
`

const Type = styled.div`
	padding: 0.35rem;
`

const FilterItem = styled.div<{ selected: boolean }>`
	cursor: pointer;
	display: flex;
	margin-right: 0.3rem;

	background-color: ${({ theme }) => theme.colors.border};

	${(props) =>
		props.selected &&
		css`
			background-color: ${({ theme }) => lighten(0.2, theme.colors.border)};

			${Count} {
				background-color: ${({ theme }) => lighten(0.3, theme.colors.border)};
			}
		`}
`

const FilterTag = styled(FilterItem)`
	margin-right: 0;
	margin-left: 0.3rem;
`
