import React, { useState } from 'react'
import { ActionableButton } from './components/ActionableButton'
import { PlayedCards } from '../../../PlayedCards/PlayedCards'
import { EffectCards } from './components/EffectCards'
import { TotalCards } from './components/TotalCards'

type Props = {}

export const TableButtons = ({}: Props) => {
	const [shown, setShown] = useState(false)

	const handleShow = () => {
		setShown(true)
	}

	return (
		<>
			{shown && <PlayedCards onClose={() => setShown(false)} />}

			<ActionableButton onClick={handleShow} />
			<EffectCards onClick={handleShow} />
			<TotalCards onClick={handleShow} />
		</>
	)
}
