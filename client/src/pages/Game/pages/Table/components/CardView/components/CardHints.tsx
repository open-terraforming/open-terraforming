import { Flex } from '@/components/Flex/Flex'
import { useGameState, usePlayerState } from '@/utils/hooks'
import { CardHint, CardHintType } from '@shared/cards/cardHints'
import {
	countGridContent,
	countTagsWithoutEvents,
	progressSymbol,
} from '@shared/cards/utils'
import { GAME_PROGRESS_MULTIPLIERS } from '@shared/constants'
import styled from 'styled-components'
import { SymbolDisplay } from './SymbolDisplay'
import { Tag } from './Tag'
import { CardType } from '@shared/cards'
import { Fragment, useState } from 'react'
import { sum } from '@shared/utils/collections'
import { rgba } from 'polished'
import { usePopout } from '@/components/Popout/usePopout'

type Props = {
	type: CardType
	hints: CardHint[]
}

export const CardHints = ({ type, hints }: Props) => {
	const [container, setContainer] = useState<HTMLDivElement | null>(null)

	const player = usePlayerState()
	const game = useGameState()

	const tooltip = usePopout({
		trigger: container,
		content: 'Current game state',
	})

	const elements = hints.map((hint, index) => {
		switch (hint.type) {
			case CardHintType.TagsCount:
				return (
					<Fragment key={index}>
						{hint.tags.map((t) => (
							<Flex key={t} gap={'0.2rem'}>
								<Tag tag={t} size="sm" />
								{hint.allPlayers
									? sum(game.players, (p) =>
											countTagsWithoutEvents(p.usedCards, t),
										)
									: countTagsWithoutEvents(player.usedCards, t)}
							</Flex>
						))}
					</Fragment>
				)
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
		}
	})

	return (
		<C $type={type} ref={setContainer}>
			{tooltip}
			{elements}
		</C>
	)
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
