import { CardType } from '@shared/cards'
import { useState } from 'react'
import { PlayedCards } from '../../../PlayedCards/PlayedCards'
import { ActionableButton } from './components/ActionableButton'
import { EffectCards } from './components/EffectCards'
import { Tags } from './components/Tags'
import { TotalCards } from './components/TotalCards'
import { CorporationButton } from './components/CorporationButton'

export const TableButtons = () => {
	const [shown, setShown] = useState(false)

	const [defaultType, setDefaultType] = useState(
		undefined as CardType | undefined,
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
			<Tags onClick={handleShow} />
			<TotalCards onClick={handleShow} />

			<CorporationButton onClick={handleShow} />
		</>
	)
}
