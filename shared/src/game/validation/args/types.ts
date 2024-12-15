import {
	Card,
	CardCallbackContext,
	CardEffectArgument,
	CardEffectArgumentValue,
} from '@shared/cards'

export type ValidatorContext = {
	card: Card
	ctx: CardCallbackContext
	a: CardEffectArgument
	value: CardEffectArgumentValue
}

export type ArgValidator = (ctx: ValidatorContext) => void
