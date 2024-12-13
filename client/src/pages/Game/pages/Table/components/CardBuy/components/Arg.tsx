import {
	CardEffectArgument,
	CardEffectArgumentType,
	CardEffectTarget,
} from '@shared/cards'
import { UsedCardState } from '@shared/index'
import { CardArg } from './CardArg'
import { CardResourceAmountArg } from './CardResourceAmountArg'
import { ChoiceArg } from './ChoiceArg'
import { CommitteePartyArg } from './CommitteePartyArg'
import { CommitteePartyMemberArg } from './CommitteePartyMemberArg'
import { PlayerArg } from './PlayerArg'
import { PlayerResourceArg } from './PlayerResourceArg'
import { ProductionArg } from './ProductionArg'
import { ResourceArg } from './ResourceArg'
import { ResourceTypeArg } from './ResourceTypeArg'
import { TileArg } from './TileArg'

type Props = {
	arg: CardEffectArgument
	card: string
	cardState: UsedCardState
	handCardIndex?: number
	onChange: (v: CardEffectArgumentType) => void
}

export const Arg = ({
	arg,
	cardState,
	card,
	onChange,
	handCardIndex,
}: Props) => {
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
			return (
				<CardArg
					arg={arg}
					onChange={onChange}
					handCardIndex={handCardIndex}
					cardState={cardState}
				/>
			)
		case CardEffectTarget.PlayerCardResource:
			return (
				<CardArg
					arg={arg}
					onChange={onChange}
					handCardIndex={handCardIndex}
					otherPlayer={true}
					cardState={cardState}
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
		case CardEffectTarget.CommitteeParty:
			return <CommitteePartyArg arg={arg} onChange={onChange} />
		case CardEffectTarget.CommitteePartyMember:
			return <CommitteePartyMemberArg arg={arg} onChange={onChange} />
		case CardEffectTarget.Tile:
			return <TileArg arg={arg} onChange={onChange} />
		default:
			return (
				<div style={{ color: '#FFB0B7' }}>
					Unknown argument {CardEffectTarget[arg.type]}
				</div>
			)
	}
}
