import { ValidatorContext, ArgValidator } from './args/types'
import { CardEffectTarget } from '@shared/cards'
import { cardArgValidator } from './args/card-arg-validator'
import { playerArgValidator } from './args/player-arg-validator'
import { productionTypeArgValidator } from './args/production-type-arg-validator'

const validators: Record<CardEffectTarget, ArgValidator | null> = {
	[CardEffectTarget.Card]: cardArgValidator,
	[CardEffectTarget.Player]: playerArgValidator,
	[CardEffectTarget.ResourceType]: productionTypeArgValidator,
	[CardEffectTarget.Cell]: null,
	[CardEffectTarget.EffectChoice]: null,
	[CardEffectTarget.PlayerCardResource]: null,
	[CardEffectTarget.PlayerResource]: null,
	[CardEffectTarget.Resource]: null
}

export const validateArgValue = (ctx: ValidatorContext) => {
	const validator = validators[ctx.a.type]

	if (validator !== null) {
		validator(ctx)
	}
}
