import { Button } from '@/components'
import { Modal } from '@/components/Modal/Modal'
import { useMemo, useState } from 'react'
import { CardDisplay, CardInfo } from '../CardDisplay/CardDisplay'
import { initialPlayerState } from '@shared/states'

type Props = {
	cards: CardInfo[]
	limit?: number
	canSubmit?: (selected: CardInfo[]) => boolean | string
	onSubmit: (selected: CardInfo[]) => void
	onClose: () => void
	title?: string
	filters?: boolean
}

const EMPTY_PLAYER = initialPlayerState()

export const CardSelector = ({
	cards,
	onSubmit,
	canSubmit,
	onClose,
	filters = true,
	title = 'Pick cards',
	limit = 1,
}: Props) => {
	const [selected, setSelected] = useState([] as CardInfo[])

	const handleSelect = (selected: CardInfo[]) => {
		if (limit === 1) {
			if (selected[0]) {
				onSubmit(selected)
			}
		} else if (selected.length < limit) {
			setSelected(selected)
		}
	}

	const handleSubmit = () => {
		onSubmit(selected)
	}

	const submittable = useMemo(
		() => (canSubmit !== undefined ? canSubmit(selected) : undefined),
		[canSubmit, selected],
	)

	return (
		<Modal
			open={true}
			onClose={onClose}
			header={title}
			footer={
				limit !== 1 && (
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
				)
			}
		>
			<CardDisplay
				cards={cards}
				onSelect={handleSelect}
				selected={selected}
				filters={filters}
				evaluateMode="static"
				player={EMPTY_PLAYER}
			/>
		</Modal>
	)
}
