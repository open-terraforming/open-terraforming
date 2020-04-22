import {
	Card,
	CardCallbackContext,
	CardEffectArgument,
	CardEffectArgumentType
} from '@shared/cards'

export type ValidatorContext = {
	card: Card
	ctx: CardCallbackContext
	a: CardEffectArgument
	value: CardEffectArgumentType
}

export type ArgValidator = (ctx: ValidatorContext) => void
