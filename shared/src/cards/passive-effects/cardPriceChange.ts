import { withUnits } from '@shared/units'
import { passiveEffect } from '../passive-effects'

export const cardPriceChange = (change: number) =>
	passiveEffect({
		description: `When you play a card, you pay ${withUnits(
			'money',
			-change,
		)} less for it`,
		onPlay: ({ player, card }) => {
			player.cardPriceChanges.push({
				change,
				sourceCardIndex: card.index,
			})
		},
	})
