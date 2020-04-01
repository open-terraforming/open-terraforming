import React, { useState, useEffect } from 'react'
import { CardEffectArgument, CardEffectArgumentType } from '@shared/cards'
import styled from 'styled-components'
import { ArgContainer } from './ArgContainer'
import { ArgsPicker } from './ArgsPicker'
import { useAppStore } from '@/utils/hooks'
import { emptyCardState } from '@shared/cards/utils'
import { UsedCardState } from '@shared/index'

type Props = {
	arg: CardEffectArgument
	onChange: (v: [number, CardEffectArgumentType[]]) => void
	card: string
	cardIndex?: number
	cardState?: UsedCardState
}

export const ChoiceArg = ({
	arg,
	onChange,
	card,
	cardIndex,
	cardState
}: Props) => {
	const [selected, setSelected] = useState(0 as number)
	const [args, setArgs] = useState([] as CardEffectArgumentType[][])

	const player = useAppStore(state => state.game.player)
	const game = useAppStore(state => state.game.state)

	useEffect(() => {
		if (selected !== undefined) {
			onChange([selected, args[selected] || []])
		}
	}, [selected, args])

	return (
		<StyledContainer>
			{arg.effects
				?.filter(
					e =>
						player &&
						game &&
						e.conditions.every(c =>
							c.evaluate({
								card: cardState || emptyCardState(card),
								cardIndex: cardIndex === undefined ? -1 : cardIndex,
								player: player.gameState,
								game,
								playerId: player.id
							})
						)
				)
				.map((e, i) => (
					<Choice
						key={i}
						onClick={() => {
							setSelected(i)
						}}
					>
						<input type="radio" checked={selected === i} readOnly />
						<div>
							{e.args.length > 0 ? (
								<ArgsPicker
									card={card}
									cardState={cardState}
									cardIndex={cardIndex}
									onChange={v => {
										const updated = [...args]
										updated[i] = v
										setArgs(updated)
									}}
									effect={e}
								/>
							) : (
								e.description
							)}
						</div>
					</Choice>
				))}
		</StyledContainer>
	)
}

const Choice = styled.div`
	display: flex;
	align-items: center;
	margin: 0.5rem 0;
	cursor: pointer;
`

const StyledContainer = styled(ArgContainer)`
	display: block;
`
