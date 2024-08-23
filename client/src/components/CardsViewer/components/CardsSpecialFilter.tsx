import { Flex } from '@/components/Flex/Flex'
import { CardSpecial } from '@shared/cards'
import { styled } from 'styled-components'

type Props = {
	specials: CardSpecial[]
	setSpecials: (set: (previous: CardSpecial[]) => CardSpecial[]) => void
}

export const CardsSpecialFilter = ({ specials, setSpecials }: Props) => {
	return (
		<Flex>
			{Object.entries(CardSpecial)
				.filter(([key]) => isNaN(Number(key)))
				.map(([key, value]) => (
					<StyledTag
						$selected={
							specials.length === 0 || specials.includes(value as CardSpecial)
						}
						key={key}
						onClick={() => {
							setSpecials((previous) =>
								previous.includes(value as CardSpecial)
									? previous.filter((tag) => tag !== value)
									: [...previous, value as CardSpecial],
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
	padding: 0.5rem;
	margin: 0.5rem;
	cursor: pointer;
`
