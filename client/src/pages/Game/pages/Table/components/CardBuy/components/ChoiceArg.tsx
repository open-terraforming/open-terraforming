import React, { useState } from 'react'
import { CardEffectArgument, CardEffectArgumentType } from '@shared/cards'
import styled from 'styled-components'
import { ArgContainer } from './ArgContainer'
import { ArgsPicker } from './ArgsPicker'

type Props = {
	arg: CardEffectArgument
	onChange: (v: [number, CardEffectArgumentType[]]) => void
}

export const ChoiceArg = ({ arg, onChange }: Props) => {
	const [selected, setSelected] = useState(undefined as number | undefined)

	return (
		<StyledContainer>
			{arg.effects?.map((e, i) => (
				<Choice key={i} onClick={() => setSelected(i)}>
					<input type="radio" checked={selected === i} readOnly />
					<div>
						{e.args.length > 0 ? (
							<ArgsPicker
								onChange={v => {
									if (selected === i) {
										onChange([selected, v])
									}
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
	margin: 0.5rem 0;
`

const StyledContainer = styled(ArgContainer)`
	display: block;
`
