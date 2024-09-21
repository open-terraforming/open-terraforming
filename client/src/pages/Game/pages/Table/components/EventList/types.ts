import { NewGeneration, PlayingChanged, ProductionPhase } from '@shared/index'

export type PopEvent = (PlayingChanged | NewGeneration | ProductionPhase) & {
	id: number
}
