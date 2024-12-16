import {
	Card,
	CardCallbackContext,
	CardEffectArgument,
	CardEffectArgumentValue,
} from '@shared/cards'
import { GridCellLocation } from '@shared/index'

export type ValidatorContext = {
	card: Card
	ctx: CardCallbackContext
	a: CardEffectArgument
	value: CardEffectArgumentValue
	usedTiles: { x: number; y: number; location?: GridCellLocation }[]
}

export type ArgValidator = (ctx: ValidatorContext) => void
