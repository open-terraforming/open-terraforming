import React, { useState, useEffect, useMemo } from 'react'
import { CardEffectArgument, CardEffectArgumentType } from '@shared/cards'
import styled, { css } from 'styled-components'
import { ArgContainer } from './ArgContainer'
import { ArgsPicker } from './ArgsPicker'
import { useAppStore } from '@/utils/hooks'
import { emptyCardState } from '@shared/cards/utils'
import { UsedCardState } from '@shared/index'

type Props = {
	arg: CardEffectArgument
	onChange: (v: [number, CardEffectArgumentType[]]) => void
	card: string
	cardState: UsedCardState
}

export const ChoiceArg = ({ arg, onChange, card, cardState }: Props) => {
	const player = useAppStore(state => state.game.player)
	const game = useAppStore(state => state.game.state)

	const choices = useMemo(
		() =>
			(arg.effects || [])
				.map((effect, index) => ({ effect, index }))
				.filter(
					({ effect }) =>
						player &&
						game &&
						effect.conditions.every(c =>
							c.evaluate({
								card: cardState || emptyCardState(card),
								cardIndex: cardState === undefined ? -1 : cardState.index,
								player: player,
								game,
								playerId: player.id
							})
						)
				),
		[arg, game, player]
	)

	const [selected, setSelected] = useState((choices[0]?.index || 0) as number)
	const [args, setArgs] = useState([] as CardEffectArgumentType[][])

	useEffect(() => {
		if (selected !== undefined) {
			onChange([selected, args[selected] || []])
		}
	}, [selected, args])

	return (
		<StyledContainer>
			{choices.map(({ effect: e, index: i }) => (
				<Choice
					key={i}
					selected={i === selected}
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
								onChange={v => {
									setArgs(args => {
										const updated = [...args]
										updated[i] = v

										return updated
									})
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

const Choice = styled.div<{ selected?: boolean }>`
	display: flex;
	align-items: center;
	margin: 0.5rem 0;
	cursor: pointer;

	opacity: 0.6;
	transition: opacity 0.1s;

	${props =>
		props.selected &&
		css`
			opacity: 1;
		`}
`

const StyledContainer = styled(ArgContainer)`
	display: block;
`
