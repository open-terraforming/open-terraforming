import { Flex } from '@/components/Flex/Flex'
import { CardType } from '@shared/cards'
import { styled } from 'styled-components'

type Props = {
	types: CardType[]
	setTypes: (set: (previous: CardType[]) => CardType[]) => void
}

export const CardsTypeFilter = ({ types, setTypes }: Props) => {
	return (
		<Flex gap="0.5rem">
			{Object.entries(CardType)
				.filter(([key]) => isNaN(Number(key)))
				.map(([key, value]) => (
					<StyledTag
						$selected={types.length === 0 || types.includes(value as CardType)}
						key={key}
						onClick={() => {
							setTypes((previous) =>
								previous.includes(value as CardType)
									? previous.filter((tag) => tag !== value)
									: [...previous, value as CardType],
							)
						}}
					>
						{key}
					</StyledTag>
				))}
		</Flex>
	)
}

const StyledTag = styled.div<{ $selected: boolean }>`
	opacity: ${(props) => (props.$selected ? 1 : 0.5)};
	padding: 0.5rem 0.5rem 0.25rem 0.5rem;
	margin: 0.5rem 0 0.25rem 0;
	cursor: pointer;
`
