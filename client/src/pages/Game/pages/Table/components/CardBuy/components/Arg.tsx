import {
	CardEffectArgument,
	CardEffectTarget,
	CardEffectArgumentType,
} from '@shared/cards'
import { PlayerArg } from './PlayerArg'
import { UsedCardState } from '@shared/index'
import { ResourceArg } from './ResourceArg'
import { ChoiceArg } from './ChoiceArg'
import { CardArg } from './CardArg'
import { PlayerResourceArg } from './PlayerResourceArg'
import { ResourceTypeArg } from './ResourceTypeArg'
import { ProductionArg } from './ProductionArg'
import { CardResourceAmountArg } from './CardResourceAmountArg'

type Props = {
	arg: CardEffectArgument
	card: string
	cardState: UsedCardState
	onChange: (v: CardEffectArgumentType) => void
}

export const Arg = ({ arg, cardState, card, onChange }: Props) => {
	switch (arg.type) {
		case CardEffectTarget.Player:
			return <PlayerArg arg={arg} card={cardState} onChange={onChange} />
		case CardEffectTarget.Resource:
			return <ResourceArg arg={arg} onChange={onChange} card={cardState} />
		case CardEffectTarget.EffectChoice:
			return (
				<ChoiceArg
					arg={arg}
					card={card}
					cardState={cardState}
					onChange={onChange}
				/>
			)
		case CardEffectTarget.Card:
			return <CardArg arg={arg} onChange={onChange} cardState={cardState} />
		case CardEffectTarget.PlayerCardResource:
			return (
				<CardArg
					arg={arg}
					onChange={onChange}
					cardState={cardState}
					otherPlayer={true}
				/>
			)
		case CardEffectTarget.PlayerResource:
			return (
				<PlayerResourceArg card={cardState} arg={arg} onChange={onChange} />
			)
		case CardEffectTarget.ResourceType:
			return <ResourceTypeArg arg={arg} onChange={onChange} />
		case CardEffectTarget.Production:
			return <ProductionArg arg={arg} card={cardState} onChange={onChange} />
		case CardEffectTarget.CardResourceCount:
			return (
				<CardResourceAmountArg
					cardState={cardState}
					arg={arg}
					onChange={onChange}
				/>
			)
		default:
			return (
				<div style={{ color: '#FFB0B7' }}>
					Unknown argument {CardEffectTarget[arg.type]}
				</div>
			)
	}
}
