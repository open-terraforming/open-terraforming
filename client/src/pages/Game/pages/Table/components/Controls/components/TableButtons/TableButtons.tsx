import React, { useState } from 'react'
import { ActionableButton } from './components/ActionableButton'
import { PlayedCards } from '../../../PlayedCards/PlayedCards'
import { EffectCards } from './components/EffectCards'
import { TotalCards } from './components/TotalCards'
import { CardType } from '@shared/cards'

type Props = {}

export const TableButtons = ({}: Props) => {
	const [shown, setShown] = useState(false)

	const [defaultType, setDefaultType] = useState(
		undefined as CardType | undefined
	)

	const handleShow = (type?: CardType) => {
		setDefaultType(type)
		setShown(true)
	}

	return (
		<>
			{shown && (
				<PlayedCards
					defaultType={defaultType}
					onClose={() => setShown(false)}
				/>
			)}

			<ActionableButton onClick={handleShow} />
			<EffectCards onClick={handleShow} />
			<TotalCards onClick={handleShow} />
		</>
	)
}
