import React, { useState, useMemo } from 'react'
import { Modal } from '@/components/Modal/Modal'
import { Button } from '@/components'
import { CardInfo, CardDisplay } from '../CardDisplay/CardDisplay'

type Props = {
	cards: CardInfo[]
	limit?: number
	canSubmit?: (selected: CardInfo[]) => boolean | string
	onSubmit: (selected: CardInfo[]) => void
	title?: string
	filters?: boolean
}

export const CardSelector = ({
	cards,
	onSubmit,
	canSubmit,
	filters = true,
	title = 'Pick cards',
	limit = 1
}: Props) => {
	const [selected, setSelected] = useState([] as CardInfo[])

	const handleSelect = (selected: CardInfo[]) => {
		if (limit === 1) {
			setSelected(selected.length > 0 ? [selected[selected.length - 1]] : [])
		} else if (selected.length < limit) {
			setSelected(selected)
		}
	}

	const handleSubmit = () => {
		onSubmit(selected)
	}

	const submittable = useMemo(
		() => (canSubmit !== undefined ? canSubmit(selected) : undefined),
		[canSubmit, selected]
	)

	return (
		<Modal
			open={true}
			contentStyle={{ width: '90%' }}
			closeOnEscape={false}
			header={title}
			footer={
				<Button
					onClick={handleSubmit}
					disabled={typeof submittable === 'string'}
				>
					{typeof submittable === 'string'
						? submittable
						: selected.length === 0
						? 'Select nothing'
						: limit > 1
						? `Select ${selected.length} cards`
						: 'Select'}
				</Button>
			}
		>
			<CardDisplay
				cards={cards}
				onSelect={handleSelect}
				selected={selected}
				filters={filters}
			/>
		</Modal>
	)
}
