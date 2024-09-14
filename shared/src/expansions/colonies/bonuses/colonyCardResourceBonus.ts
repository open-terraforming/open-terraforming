import { CardResource } from '@shared/cards'
import { addCardResourceAction } from '@shared/player-actions'
import { pushPendingAction } from '@shared/utils'
import { colonyBonus } from '../templates/colonyBonus'
import { mapCards } from '@shared/utils/mapCards'

export const colonyCardResourceBonus = (
	cardResource: CardResource,
	count: number,
) =>
	colonyBonus({
		symbols: [{ cardResource, count }],
		condition: ({ player }) =>
			mapCards(player.usedCards).some((c) => c.info.resource === cardResource),
		perform: ({ player }) => {
			pushPendingAction(player, addCardResourceAction(cardResource, count))
		},
	})
