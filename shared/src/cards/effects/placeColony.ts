import { pushPendingAction } from '@shared/utils'
import { SymbolType } from '../types'
import { effect } from './types'
import { buildColonyAction } from '@shared/player-actions'

type Params = {
	allowMoreColoniesPerColony?: boolean
}

export const placeColony = ({ allowMoreColoniesPerColony }: Params = {}) =>
	effect({
		description: 'Place a colony',
		symbols: [{ symbol: SymbolType.Colony }],
		perform: ({ player }) => {
			pushPendingAction(
				player,
				buildColonyAction({
					allowMoreColoniesPerColony: !!allowMoreColoniesPerColony,
				}),
			)
		},
	})
