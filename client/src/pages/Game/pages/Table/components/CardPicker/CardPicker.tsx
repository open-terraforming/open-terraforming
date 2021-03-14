import { Button } from '@/components'
import { HelpMessage } from '@/components/HelpMessage/HelpMessage'
import { Modal } from '@/components/Modal/Modal'
import { useApi } from '@/context/ApiContext'
import { cards } from '@/i18n/en/cards'
import { help } from '@/i18n/en/help'
import { useAppStore } from '@/utils/hooks'
import { CardsLookupApi } from '@shared/cards'
import { draftCard, pickCards, pickPreludes } from '@shared/index'
import { PlayerAction, PlayerActionType } from '@shared/player-actions'
import React, { useMemo, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { CardsContainer } from '../CardsContainer/CardsContainer'
import { CardView } from '../CardView/CardView'
import { ResourceIcon } from '../ResourceIcon/ResourceIcon'
import { CardPickerHeader } from './components/CardPickerHeader'

type Props = {
	action: PlayerAction
	closeable?: boolean
	onClose?: () => void
}

export const CardPicker = ({ action, closeable, onClose }: Props) => {
	const api = useApi()
	const player = useAppStore(state => state.game.player)
	const game = useAppStore(state => state.game.state)
	const state = player

	if (
		action.type !== PlayerActionType.PickCards &&
		action.type !== PlayerActionType.PickPreludes &&
		action.type !== PlayerActionType.DraftCard
	) {
		throw new Error('Not card picker')
	}

	const cardsToPick = useMemo(
		() => action.cards.map(c => CardsLookupApi.get(c)),
		[action.cards]
	)

	const cardsLimit = action.limit

	const isFree =
		action.type === PlayerActionType.PickPreludes ||
		action.type === PlayerActionType.DraftCard ||
		action.free

	const [selected, setSelected] = useState([] as number[])
	const [loading, setLoading] = useState(false)

	const price = isFree ? 0 : selected.length * game.cardPrice
	const canAfford = state && price <= state.money

	const handleConfirm = () => {
		setLoading(true)

		switch (action.type) {
			case PlayerActionType.PickCards: {
				return api.send(pickCards(selected))
			}

			case PlayerActionType.PickPreludes: {
				return api.send(pickPreludes(selected))
			}

			case PlayerActionType.DraftCard: {
				return api.send(draftCard(selected))
			}
		}
	}

	const title = useMemo(() => {
		switch (action.type) {
			case PlayerActionType.PickCards: {
				return cardsLimit === 0
					? `Pick projects to sponsor`
					: `Pick ${cardsLimit} projects to sponsor`
			}

			case PlayerActionType.PickPreludes: {
				return `Pick ${cardsLimit} preludes`
			}

			case PlayerActionType.DraftCard: {
				return `Pick a project to draft`
			}
		}
	}, [action])

	const helpMessage = useMemo(() => {
		switch (action.type) {
			case PlayerActionType.PickCards: {
				return isFree ? undefined : help.sponsoredProjects
			}

			case PlayerActionType.PickPreludes: {
				return help.preludes
			}

			case PlayerActionType.DraftCard: {
				return help.draftedProjects
			}
		}
	}, [action])

	const pickMessage = useMemo(() => {
		switch (action.type) {
			case PlayerActionType.PickCards: {
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

			case PlayerActionType.PickPreludes: {
				return selected.length > 0
					? `Pick ${selected.length} preludes`
					: 'Pick nothing'
			}

			case PlayerActionType.DraftCard: {
				return selected.length > 0
					? `Pick ${cards[cardsToPick[selected[0]].code]}`
					: 'Pick nothing'
			}
		}
	}, [action, selected, price, isFree])

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
		>
			<CardsContainer style={{ flex: 1 }}>
				{cardsToPick?.map(
					(c, i) =>
						c && (
							<PopInContainer
								key={i}
								style={{
									animationDelay: `${i * 200}ms`
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
															? selected.filter(s => s !== i)
															: cardsLimit === 0 || selected.length < cardsLimit
															? [...selected, i]
															: cardsLimit === 1
															? [i]
															: selected
													)
											  }
											: undefined
									}
								/>
							</PopInContainer>
						)
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
