import {
	CardEffectArgument,
	CardEffectArgumentType,
	CardEffectArgumentValue,
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
	onChange: (v: CardEffectArgumentValue) => void
}

export const Arg = ({
	arg,
	cardState,
	card,
	onChange,
	handCardIndex,
}: Props) => {
	switch (arg.type) {
		case CardEffectArgumentType.Player:
			return <PlayerArg arg={arg} card={cardState} onChange={onChange} />
		case CardEffectArgumentType.ResourceCount:
			return <ResourceArg arg={arg} onChange={onChange} card={cardState} />
		case CardEffectArgumentType.EffectChoice:
			return (
				<ChoiceArg
					arg={arg}
					card={card}
					cardState={cardState}
					onChange={onChange}
				/>
			)
		case CardEffectArgumentType.Card:
			return (
				<CardArg
					arg={arg}
					onChange={onChange}
					handCardIndex={handCardIndex}
					cardState={cardState}
				/>
			)
		case CardEffectArgumentType.PlayerCardResource:
			return (
				<CardArg
					arg={arg}
					onChange={onChange}
					handCardIndex={handCardIndex}
					otherPlayer={true}
					cardState={cardState}
				/>
			)
		case CardEffectArgumentType.PlayerResource:
			return (
				<PlayerResourceArg card={cardState} arg={arg} onChange={onChange} />
			)
		case CardEffectArgumentType.ResourceType:
			return <ResourceTypeArg arg={arg} onChange={onChange} />
		case CardEffectArgumentType.ProductionCount:
			return <ProductionArg arg={arg} card={cardState} onChange={onChange} />
		case CardEffectArgumentType.CardResourceCount:
			return (
				<CardResourceAmountArg
					cardState={cardState}
					arg={arg}
					onChange={onChange}
				/>
			)
		case CardEffectArgumentType.CommitteeParty:
			return <CommitteePartyArg arg={arg} onChange={onChange} />
		case CardEffectArgumentType.CommitteePartyMember:
			return <CommitteePartyMemberArg arg={arg} onChange={onChange} />
		case CardEffectArgumentType.Tile:
			return <TileArg arg={arg} onChange={onChange} />
		default:
			return (
				<div style={{ color: '#FFB0B7' }}>
					Unknown argument {CardEffectArgumentType[arg.type]}
				</div>
			)
	}
}
