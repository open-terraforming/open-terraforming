import { CardResource } from '@shared/cards'
import { addCardResourceAction } from '@shared/player-actions'
import { pushPendingAction } from '@shared/utils'
import { colonyBonus } from '../utils'

export const colonyCardResourceBonus = (
	cardResource: CardResource,
	count: number,
) =>
	colonyBonus({
		symbols: [{ cardResource, count }],
		perform: ({ player }) => {
			pushPendingAction(player, addCardResourceAction(cardResource, count))
		},
	})
