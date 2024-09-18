import { Colony, ColonyState } from '@shared/game'

export const initialColonyState = (colony: Colony): ColonyState => ({
	code: colony.code,
	active: !colony.activationCallback,
	playersAtSteps: [],
	step: colony.activationCallback ? -1 : (colony.startingStep ?? 1),
})
