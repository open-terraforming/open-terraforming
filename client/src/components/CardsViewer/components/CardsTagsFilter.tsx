import { Flex } from '@/components/Flex/Flex'
import { Tag } from '@/pages/Game/pages/Table/components/CardView/components/Tag'
import { CardCategory } from '@shared/cards'
import { styled } from 'styled-components'

type Props = {
	tags: CardCategory[]
	setTags: (set: (previous: CardCategory[]) => CardCategory[]) => void
}

export const CardsTagsFilter = ({ tags, setTags }: Props) => {
	return (
		<Flex>
			{Object.entries(CardCategory)
				.filter(([key]) => isNaN(Number(key)))
				.map(([key, value]) => (
					<StyledTag
						$selected={
							tags.length === 0 || tags.includes(value as CardCategory)
						}
						key={key}
					>
						<Tag
							tag={value as CardCategory}
							onClick={() => {
								setTags(previous =>
									previous.includes(value as CardCategory)
										? previous.filter(tag => tag !== value)
										: [...previous, value as CardCategory]
								)
							}}
						/>
					</StyledTag>
				))}
		</Flex>
	)
}

const StyledTag = styled.div<{ $selected: boolean }>`
	opacity: ${props => (props.$selected ? 1 : 0.5)};
	padding-top: 0.2rem;
	cursor: pointer;
`
