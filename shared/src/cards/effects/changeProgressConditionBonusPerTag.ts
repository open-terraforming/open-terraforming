import { f } from '../../utils'
import { effect } from './types'
import { CardCategory } from '../types'

export const changeProgressConditionBonusPerTag = (
	category: CardCategory,
	change: number,
) =>
	effect({
		description: f(
			'Effect: Your global requirements are +{0} or -{1} steps (your choice) for cards with {2} tag',
			change,
			change,
			CardCategory[category],
		),
		perform: ({ player }) => {
			if (!player.progressConditionBonusByTag[category]) {
				player.progressConditionBonusByTag[category] = change
			} else {
				player.progressConditionBonusByTag[category] += change
			}
		},
	})
