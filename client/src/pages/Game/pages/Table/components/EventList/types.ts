import {
	BaseGameEvent,
	NewGeneration,
	PlayingChanged,
	ProductionPhase,
} from '@shared/index'

export type PopEvent = BaseGameEvent &
	(PlayingChanged | NewGeneration | ProductionPhase) & {
		id: number
	}
