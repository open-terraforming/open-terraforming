import { CardEffectTarget } from '@shared/cards'
import { cardArgValidator } from './args/card-arg-validator'
import { cardResourceAmountArgValidator } from './args/card-resource-amount-arg-validator'
import { committeePartyMemberValidator } from './args/committeePartyMemberValidator'
import { committeePartyValidator } from './args/committeePartyValidator'
import { playerArgValidator } from './args/player-arg-validator'
import { productionArgValidator } from './args/production-arg-validator'
import { productionTypeArgValidator } from './args/production-type-arg-validator'
import { ArgValidator, ValidatorContext } from './args/types'
import { tileArgValidator } from './args/tileArgValidator.ts'

const validators: Record<CardEffectTarget, ArgValidator | null> = {
	[CardEffectTarget.Card]: cardArgValidator,
	[CardEffectTarget.Player]: playerArgValidator,
	[CardEffectTarget.ResourceType]: productionTypeArgValidator,
	[CardEffectTarget.Tile]: tileArgValidator,
	[CardEffectTarget.EffectChoice]: null,
	[CardEffectTarget.PlayerCardResource]: null,
	[CardEffectTarget.PlayerResource]: null,
	[CardEffectTarget.Resource]: null,
	[CardEffectTarget.Production]: productionArgValidator,
	[CardEffectTarget.CardResourceCount]: cardResourceAmountArgValidator,
	[CardEffectTarget.CommitteeParty]: committeePartyValidator,
	[CardEffectTarget.CommitteePartyMember]: committeePartyMemberValidator,
}

export const validateArgValue = (ctx: ValidatorContext) => {
	const validator = validators[ctx.a.type]

	if (validator !== null) {
		validator(ctx)
	}
}
