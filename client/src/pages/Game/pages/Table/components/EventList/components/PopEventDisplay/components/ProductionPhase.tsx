import React from 'react'
import { CenteredText } from './CenteredText'

type Props = {
	onDone: () => void
}

export const ProductionPhase = ({ onDone }: Props) => {
	return (
		<CenteredText onDone={onDone} color="#FFC891" textColor="#111">
			Production phase
		</CenteredText>
	)
}
