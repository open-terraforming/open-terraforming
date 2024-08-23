import { Button } from '@/components'
import { HelpMessage } from '@/components/HelpMessage/HelpMessage'
import { Modal } from '@/components/Modal/Modal'
import { cards as cardNames } from '@/i18n/en/cards'
import { help } from '@/i18n/en/help'
import { useAppStore } from '@/utils/hooks'
import { CardsLookupApi } from '@shared/cards'
import { useMemo, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { CardsContainer } from '../CardsContainer/CardsContainer'
import { CardView } from '../CardView/CardView'
import { ResourceIcon } from '../ResourceIcon/ResourceIcon'
import { CardPickerHeader } from './components/CardPickerHeader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

export enum PickerType {
	Cards,
	Preludes,
	Draft,
}

type Props = {
	type: PickerType
	cards: string[]
	onSelect: (cards: number[]) => void

	selected?: number[]
	moneyOverride?: number
	loading?: boolean
	free?: boolean
	limit?: number
	closeable?: boolean
	closeAsMinimize?: boolean
	onClose?: () => void
}

export const CardPicker = ({
	type,
	limit: cardsLimit = 0,
	free: isFree = false,
	selected: preSelected = [],
	cards,
	onSelect,
	closeable,
	closeAsMinimize,
	onClose,
	loading,
	moneyOverride,
}: Props) => {
	const player = useAppStore((state) => state.game.player)
	const game = useAppStore((state) => state.game.state)
	const state = player

	const cardsToPick = useMemo(
		() => cards.map((c) => CardsLookupApi.get(c)),
		[cards],
	)

	const [selected, setSelected] = useState(preSelected)

	const price = isFree ? 0 : selected.length * game.cardPrice
	const canAfford = state && price <= (moneyOverride ?? state.money)

	const handleConfirm = () => {
		onSelect(selected)
	}

	const title = useMemo(() => {
		switch (type) {
			case PickerType.Cards: {
				return cardsLimit === 0
					? `Pick projects to sponsor`
					: `Pick ${cardsLimit} projects to sponsor`
			}

			case PickerType.Preludes: {
				return `Pick ${cardsLimit} preludes`
			}

			case PickerType.Draft: {
				return `Pick a project to draft`
			}
		}
	}, [type])

	const helpMessage = useMemo(() => {
		switch (type) {
			case PickerType.Cards: {
				return isFree ? undefined : help.sponsoredProjects
			}

			case PickerType.Preludes: {
				return help.preludes
			}

			case PickerType.Draft: {
				return help.draftedProjects
			}
		}
	}, [type])

	const pickMessage = useMemo(() => {
		switch (type) {
			case PickerType.Cards: {
				return !isFree ? (
					selected.length > 0 ? (
						<>
							{`Sponsor ${selected.length} projects for ${price}`}
							<ResourceIcon res="money" />
						</>
					) : (
						'Sponsor nothing'
					)
				) : selected.length > 0 ? (
					`Pick ${selected.length} projects`
				) : (
					'Pick nothing'
				)
			}

			case PickerType.Preludes: {
				return selected.length > 0
					? `Pick ${selected.length} preludes`
					: 'Pick nothing'
			}

			case PickerType.Draft: {
				return selected.length > 0
					? `Pick ${cardNames[cardsToPick[selected[0]].code]}`
					: 'Pick nothing'
			}
		}
	}, [type, selected, price, isFree])

	if (!game || !player) {
		return <>No game / player</>
	}

	return (
		<Modal
			open={true}
			allowClose={closeable}
			onClose={onClose}
			headerStyle={{ justifyContent: 'center' }}
			header={<CardPickerHeader text={title} />}
			footer={
				<Button
					onClick={handleConfirm}
					disabled={
						loading ||
						!canAfford ||
						(cardsLimit !== 0 && isFree && selected.length !== cardsLimit)
					}
					isLoading={loading}
				>
					{pickMessage}
				</Button>
			}
			bodyStyle={{ display: 'flex', flexDirection: 'column' }}
			closeIcon={
				closeAsMinimize ? <FontAwesomeIcon icon={faChevronDown} /> : undefined
			}
		>
			<CardsContainer style={{ flex: 1 }}>
				{cardsToPick?.map(
					(c, i) =>
						c && (
							<PopInContainer
								key={i}
								style={{
									animationDelay: `${i * 200}ms`,
								}}
							>
								<CardView
									card={c}
									selected={selected.includes(i)}
									fade={false}
									onClick={
										!loading
											? () => {
													setSelected(
														selected.includes(i)
															? selected.filter((s) => s !== i)
															: cardsLimit === 0 || selected.length < cardsLimit
																? [...selected, i]
																: cardsLimit === 1
																	? [i]
																	: selected,
													)
												}
											: undefined
									}
								/>
							</PopInContainer>
						),
				)}
			</CardsContainer>

			{helpMessage && (
				<HelpMessage id="card-picker-help" message={helpMessage} />
			)}
		</Modal>
	)
}

const PopIn = keyframes`
	0% { transform: scale(1.1); opacity: 0; }
	100% { transform: scale(1); opacity: 1; }
`

const PopInContainer = styled.div`
	animation-name: ${PopIn};
	animation-duration: 300ms;
	animation-fill-mode: forwards;
	opacity: 0;
`
