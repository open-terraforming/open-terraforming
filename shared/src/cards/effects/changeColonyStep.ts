import { changeColonyStepAction } from '@shared/player-actions'
import { f } from '@shared/utils/f'
import { pushPendingAction } from '@shared/utils/pushPendingAction'
import { quantized } from '@shared/utils/quantized'
import { effect } from './types'

export const changeColonyStep = (change: number) =>
	effect({
		description:
			change > 0
				? f(
						'Increase trade income of a colony by {0}',
						quantized(change, 'step', 'steps'),
					)
				: f(
						'Decrease trade income of a colony by {0}',
						quantized(-change, 'step', 'steps'),
					),
		perform: ({ player }) => {
			pushPendingAction(player, changeColonyStepAction({ change }))
		},
	})
