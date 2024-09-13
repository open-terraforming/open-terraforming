import { getPlayerIndex, pushPendingAction } from '@shared/utils'
import { SymbolType } from '../types'
import { effect } from './types'
import { buildColonyAction } from '@shared/player-actions'

type Params = {
	allowMoreColoniesPerColony?: boolean
}

export const placeColony = ({ allowMoreColoniesPerColony }: Params = {}) =>
	effect({
		description:
			'Place a colony' +
			(allowMoreColoniesPerColony
				? ' (even if you already have one there)'
				: ''),
		symbols: [{ symbol: SymbolType.Colony }],
		conditions: [
			{
				symbols: [],
				evaluate: ({ game, player }) => {
					const playerIndex = getPlayerIndex(game, player.id)

					return game.colonies.some(
						(c) =>
							c.playersAtSteps.length < 3 &&
							(allowMoreColoniesPerColony ||
								c.playersAtSteps.includes(playerIndex)),
					)
				},
			},
		],
		perform: ({ player }) => {
			pushPendingAction(
				player,
				buildColonyAction({
					allowMoreColoniesPerColony: !!allowMoreColoniesPerColony,
				}),
			)
		},
	})
