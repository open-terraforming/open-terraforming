import { useAppStore } from '@/utils/hooks'
import { CardsLookupApi, CardType, CardCategory } from '@shared/cards'
import React, { useState, useMemo } from 'react'
import { CardsCounter } from '../../CardsCounter'
import { voidReduce } from '@/utils/collections'
import { TagCount, HoverTags } from './HoverTags'

type Props = {
	onClick: () => void
}

export const Tags = ({ onClick }: Props) => {
	const usedCards = useAppStore(state => state.game.player.usedCards)
	const [open, setOpen] = useState(false)

	const tags = useMemo(
		() =>
			Object.values(
				voidReduce(usedCards, {} as Record<number, TagCount>, (acc, c) => {
					const info = CardsLookupApi.get(c.code)

					const categories =
						info.type !== CardType.Event
							? info.categories
							: [CardCategory.Event]

					categories.forEach(c => {
						const exists = acc[c] || { tag: c, count: 0 }
						acc[c] = { tag: c, count: exists.count + 1 }
					})
				})
			).sort((a, b) => a.tag - b.tag),
		[usedCards]
	)

	const count = useMemo(() => tags.reduce((acc, c) => acc + c.count, 0), [tags])

	return (
		<CardsCounter
			onClick={onClick}
			count={count}
			text="Tags"
			onMouseOver={() => setOpen(true)}
			onMouseLeave={() => setOpen(false)}
		>
			<HoverTags tags={tags} open={open} />
		</CardsCounter>
	)
}
