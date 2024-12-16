import { Tooltip } from '@/components'
import { Flex } from '@/components/Flex/Flex'
import { useLocale } from '@/context/LocaleContext'
import { useGameState } from '@/utils/hooks'
import { CardCategory, CardsLookupApi, CardType } from '@shared/cards'
import { CardHint, CardHintType } from '@shared/cards/cardHints'
import { countTagsWithoutEvents } from '@shared/cards/utils'
import { PlayerState } from '@shared/gameState'
import { isNotUndefined, sum } from '@shared/utils/collections'
import { useMemo } from 'react'
import styled from 'styled-components'
import { Tag } from './Tag'

type Props = {
	player: PlayerState
	hint: Extract<CardHint, { type: CardHintType.TagsCount }>
}

export const TagsCountCardHint = ({ player, hint }: Props) => {
	const t = useLocale()
	const game = useGameState()

	const cards = useMemo(
		() =>
			(hint.allPlayers ? game.players : [player])
				.flatMap((p) => {
					return p.usedCards.map((c) => {
						const info = CardsLookupApi.get(c.code)

						if (info.type === CardType.Event) {
							return
						}

						const matchingTags = info.categories.filter(
							(c) => hint.tags.includes(c) || c === CardCategory.Any,
						)

						if (matchingTags.length > 0) {
							return {
								player: p,
								card: c.code,
								tags: matchingTags,
							}
						}
					})
				})
				.filter(isNotUndefined),
		[hint, game.players, player],
	)

	return (
		<Tooltip
			content={
				cards.length > 0 ? (
					<TooltipContainer>
						{cards.map((info, index) => (
							<Flex key={index} gap={'0.2rem'}>
								<span>{t.cards[info.card]}</span>
								<TagsContainer>
									{info.tags.map((t, i) => (
										<Tag key={i} tag={t} size="sm" />
									))}
								</TagsContainer>
							</Flex>
						))}
					</TooltipContainer>
				) : undefined
			}
		>
			<Flex gap="0.25rem">
				{hint.tags.map((t) => (
					<Flex key={t} gap={'0.1rem'}>
						<Tag tag={t} size="sm" />
						{hint.allPlayers
							? sum(game.players, (p) => countTagsWithoutEvents(p.usedCards, t))
							: countTagsWithoutEvents(player.usedCards, t)}
					</Flex>
				))}
			</Flex>
		</Tooltip>
	)
}

const TooltipContainer = styled.div`
	font-size: 85%;
`

const TagsContainer = styled(Flex)`
	margin-left: auto;
`
