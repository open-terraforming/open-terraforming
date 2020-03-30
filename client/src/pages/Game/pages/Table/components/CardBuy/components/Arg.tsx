import React from 'react'
import {
	CardEffectArgument,
	CardEffectTarget,
	CardEffectArgumentType
} from '@shared/cards'
import { PlayerArg } from './PlayerArg'
import { UsedCardState } from '@shared/index'

type Props = {
	arg: CardEffectArgument
	card?: UsedCardState
	onChange: (v: CardEffectArgumentType) => void
}

export const Arg = ({ arg, card, onChange }: Props) => {
	switch (arg.type) {
		case CardEffectTarget.Player:
			return <PlayerArg arg={arg} onChange={onChange} />
		default:
			return <div>Unknown argument!</div>
	}
}
