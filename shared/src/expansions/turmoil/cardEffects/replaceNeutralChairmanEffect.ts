import { SymbolType } from '@shared/cards'
import { effect } from '@shared/cards/effects/types'

export const replaceNeutralChairmanEffect = () =>
	effect({
		description: 'Replace neutral chairman with your delegate from reserve',
		symbols: [
			{ symbol: SymbolType.Chairman },
			{ symbol: SymbolType.RightArrow },
			{ symbol: SymbolType.Chairman },
		],
		perform({ game, player }) {
			const chairman = game.committee.chairman

			if (chairman === null) {
				throw new Error('No chairman to replace')
			}

			if (chairman.playerId !== null) {
				throw new Error('Chairman is not neutral')
			}

			const reserveIndex = game.committee.reserve.findIndex(
				(delegate) => delegate?.id === player.id,
			)

			if (reserveIndex < 0) {
				throw new Error('No reserve delegate found')
			}

			game.committee.reserve.splice(reserveIndex, 1)
			game.committee.chairman = { playerId: { id: player.id } }
			game.committee.reserve.push(null)
		},
	})
