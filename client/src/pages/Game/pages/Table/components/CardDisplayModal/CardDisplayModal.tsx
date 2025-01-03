import { Checkbox } from '@/components/Checkbox/Checkbox'
import { Flex } from '@/components/Flex/Flex'
import { MinimizeIcon } from '@/components/MinimizeIcon'
import { Modal } from '@/components/Modal/Modal'
import { TabsHead } from '@/components/TabsHead'
import { media } from '@/styles/media'
import { isNotUndefined, mapRight } from '@/utils/collections'
import { Card, CardCategory, CardType } from '@shared/cards'
import { PlayerState, UsedCardState } from '@shared/index'
import { lighten } from 'polished'
import {
	CSSProperties,
	ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react'
import styled, { css } from 'styled-components'
import { NoCards } from '../CardsContainer/CardsContainer'
import { CardEvaluateMode, CardView } from '../CardView/CardView'
import { Tag } from '../CardView/components/Tag'

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
	hover?: boolean
	hideAdjustedPrice?: boolean
	player: PlayerState
	evaluateMode: CardEvaluateMode

	onClose?: () => void
	header?: ReactNode
	footer?: ReactNode
	contentStyle?: CSSProperties
	bodyStyle?: CSSProperties
	hideClose?: boolean
	postfix?: ReactNode
	closeAsMinimize?: boolean
}

const createTypeFilter = (type: CardType | undefined) => (ci: CardInfo) => {
	if (type === undefined) {
		return true
	}

	if (
		type === CardType.Effect &&
		ci.card.type === CardType.Corporation &&
		ci.card.passiveEffects.length > 0
	) {
		return true
	}

	if (
		type === CardType.Action &&
		ci.card.type === CardType.Corporation &&
		ci.card.actionEffects.length > 0
	) {
		return true
	}

	return ci.card.type === type
}

export const CardDisplayModal = <T extends CardInfo>({
	onSelect,
	selected,
	cards,
	filters = true,
	evaluateMode,
	hover = true,
	defaultType,
	hideAdjustedPrice,
	player,
	onClose,
	contentStyle,
	bodyStyle,
	header,
	footer,
	hideClose,
	postfix,
	closeAsMinimize,
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

	const currentTypeFilter = useCallback(createTypeFilter(type), [type])

	const types = useMemo(
		() =>
			[
				[undefined, 'All'] as const,
				[CardType.Action, 'With Action'] as const,
				[CardType.Effect, 'Effects'] as const,
				[CardType.Building, 'Automated'] as const,
				[CardType.Event, 'Events'] as const,
				[CardType.Prelude, 'Prelude'] as const,
				[CardType.Corporation, 'Corporation'] as const,
			]
				.map(
					([c, title]) =>
						[c, title, cards.filter(createTypeFilter(c)).length] as const,
				)
				.filter(([, , count]) => count > 0),
		[cards],
	)

	const filtered = useMemo(
		() =>
			cards.filter(
				(ci) =>
					currentTypeFilter(ci) &&
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
		<Modal
			open={true}
			contentStyle={contentStyle}
			bodyStyle={{ ...bodyStyle, padding: 0 }}
			headerStyle={{
				borderBottom: 'none',
				padding: '0.5rem 1rem',
			}}
			onClose={onClose}
			hideClose={hideClose}
			header={header}
			footer={footer}
			closeIcon={closeAsMinimize ? <MinimizeIcon /> : undefined}
		>
			<TabsHead
				tab={type}
				setTab={setType}
				tabs={types.map(([cat, t, count]) => ({
					title: (
						<Flex>
							{t} <FilterCount>{count}</FilterCount>
						</Flex>
					),
					key: cat,
				}))}
				suffix={
					filters ? (
						<Filters>
							{(evaluateMode === 'playing' || evaluateMode === 'buying') && (
								<Checkbox
									checked={playable}
									onChange={(v) => setPlayable(v)}
									label="Only playable"
								/>
							)}
						</Filters>
					) : undefined
				}
			/>

			<Flex align="stretch" gap="0.25rem">
				<CardsContainer playableOnly={playable}>
					{filtered.length === 0 && <NoCards>No cards</NoCards>}
					{mapRight(
						filtered,
						(c) =>
							c && (
								<CardView
									hover={hover}
									evaluateMode={evaluateMode}
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
			</Flex>

			{postfix}
		</Modal>
	)
}

const CardsContainer = styled.div<{ playableOnly: boolean }>`
	display: flex;
	overflow: auto;
	flex-wrap: wrap;
	justify-content: center;
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

const Categories = styled(Flex)`
	flex-direction: column;
	align-items: stretch;
`

const Filters = styled.div`
	display: flex;
	align-items: center;
	font-size: 1rem;
	margin-left: auto;
	align-self: center;
`

const Count = styled.div`
	padding: 0.35rem;
	background-color: ${({ theme }) => lighten(0.1, theme.colors.border)};

	display: flex;
	align-items: center;
	justify-content: center;

	flex: 1;
`

const FilterCount = styled.div`
	margin-left: 0.5rem;
	opacity: 0.7;
`

const Type = styled.div`
	padding: 0.35rem;
`

const FilterItem = styled.div<{ selected: boolean }>`
	cursor: pointer;
	border: 2px solid ${({ theme }) => theme.colors.border};
	border-top: none;
	border-right: none;
	display: flex;

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
