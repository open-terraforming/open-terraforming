import { Flex } from '@/components/Flex/Flex'
import { useGameState } from '@/utils/hooks'
import { CardType, SymbolType } from '@shared/cards'
import { CardHint, CardHintType } from '@shared/cards/cardHints'
import { countGridContent, progressSymbol } from '@shared/cards/utils'
import { GAME_PROGRESS_MULTIPLIERS } from '@shared/constants'
import { getColoniesCount } from '@shared/expansions/colonies/utils/getColoniesCount'
import { PlayerState } from '@shared/gameState'
import { assertNever } from '@shared/utils/assertNever'
import { rgba } from 'polished'
import styled from 'styled-components'
import { SymbolDisplay } from './SymbolDisplay'
import { TagsCountCardHint } from './TagsCountCardHint'

type Props = {
	type: CardType
	hints: CardHint[]
	player: PlayerState
}

export const CardHints = ({ type, hints, player }: Props) => {
	const game = useGameState()

	const elements = hints.map((hint, index) => {
		switch (hint.type) {
			case CardHintType.TagsCount:
				return <TagsCountCardHint key={index} player={player} hint={hint} />

			case CardHintType.Progress:
				return (
					<Flex key={index} gap={'0.2rem'}>
						{hint.progress === 'oceans' ? (
							<SmallSymbol symbol={progressSymbol[hint.progress]} noSpacing />
						) : (
							<SymbolDisplay symbol={progressSymbol[hint.progress]} noSpacing />
						)}
						{game[hint.progress] * GAME_PROGRESS_MULTIPLIERS[hint.progress]}
					</Flex>
				)

			case CardHintType.TileCount:
				return (
					<Flex key={index}>
						<SmallSymbol symbol={{ tile: hint.tileType }} noSpacing />
						{countGridContent(game, hint.tileType)}
					</Flex>
				)

			case CardHintType.ColonyCount:
				return (
					<Flex key={index}>
						<SmallSymbol symbol={{ symbol: SymbolType.Colony }} noSpacing />
						{getColoniesCount({ game })}
					</Flex>
				)
		}

		assertNever(hint)
	})

	return <C $type={type}>{elements}</C>
}

const C = styled.div<{ $type: CardType }>`
	position: absolute;
	right: 2rem;
	top: 100%;
	margin-top: -1.2rem;
	display: flex;
	gap: 0.2rem;
	background: ${(props) => rgba(props.theme.colors.background, 1)};
	border: 0.2rem solid ${(props) => props.theme.colors.cards[props.$type]};
	/*border-bottom: 0;
	border-right: 0;*/
	padding: 0.2rem 0.3rem;
	z-index: 3;
	box-sizing: border-box;
`

const SmallSymbol = styled(SymbolDisplay)`
	font-size: 60%;
`
