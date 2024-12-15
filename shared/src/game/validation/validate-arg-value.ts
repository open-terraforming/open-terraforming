import { CardEffectArgumentType } from '@shared/cards'
import { cardArgValidator } from './args/card-arg-validator'
import { cardResourceAmountArgValidator } from './args/card-resource-amount-arg-validator'
import { committeePartyMemberValidator } from './args/committeePartyMemberValidator'
import { committeePartyValidator } from './args/committeePartyValidator'
import { playerArgValidator } from './args/player-arg-validator'
import { productionArgValidator } from './args/production-arg-validator'
import { productionTypeArgValidator } from './args/production-type-arg-validator'
import { ArgValidator, ValidatorContext } from './args/types'
import { tileArgValidator } from './args/tileArgValidator.ts'

const validators: Record<CardEffectArgumentType, ArgValidator | null> = {
	[CardEffectArgumentType.Card]: cardArgValidator,
	[CardEffectArgumentType.Player]: playerArgValidator,
	[CardEffectArgumentType.ResourceType]: productionTypeArgValidator,
	[CardEffectArgumentType.Tile]: tileArgValidator,
	[CardEffectArgumentType.EffectChoice]: null,
	[CardEffectArgumentType.PlayerCardResource]: null,
	[CardEffectArgumentType.PlayerResource]: null,
	[CardEffectArgumentType.ResourceCount]: null,
	[CardEffectArgumentType.ProductionCount]: productionArgValidator,
	[CardEffectArgumentType.CardResourceCount]: cardResourceAmountArgValidator,
	[CardEffectArgumentType.CommitteeParty]: committeePartyValidator,
	[CardEffectArgumentType.CommitteePartyMember]: committeePartyMemberValidator,
}

export const validateArgValue = (ctx: ValidatorContext) => {
	const validator = validators[ctx.a.type]

	if (validator !== null) {
		validator(ctx)
	}
}
