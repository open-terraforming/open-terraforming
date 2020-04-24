import { Button } from '@/components'
import { Modal } from '@/components/Modal/Modal'
import { useApi } from '@/context/ApiContext'
import { colors } from '@/styles'
import { useAppStore } from '@/utils/hooks'
import { faThermometerHalf, faTint } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CardsLookupApi } from '@shared/cards'
import { CARD_PRICE } from '@shared/constants'
import { pickCards, pickPreludes } from '@shared/index'
import React, { useState, useMemo } from 'react'
import styled, { keyframes } from 'styled-components'
import { CardsContainer } from '../CardsContainer/CardsContainer'
import { CardView } from '../CardView/CardView'
import { PlayerActionType } from '@shared/player-actions'

type Props = {
	prelude?: boolean
}

export const CardPicker = ({ prelude }: Props) => {
	const api = useApi()
	const player = useAppStore(state => state.game.player)
	const game = useAppStore(state => state.game.state)
	const state = player

	const pendingAction = useAppStore(state => state.game.pendingAction)

	if (
		!pendingAction ||
		(pendingAction?.type !== PlayerActionType.PickCards &&
			pendingAction?.type !== PlayerActionType.PickPreludes)
	) {
		throw new Error('Not card picker')
	}

	const cardsToPick = useMemo(
		() => pendingAction.cards.map(c => CardsLookupApi.get(c)),
		[pendingAction.cards]
	)

	const cardsLimit = pendingAction.limit

	const isFree =
		pendingAction?.type === PlayerActionType.PickPreludes || pendingAction.free

	const [selected, setSelected] = useState([] as number[])
	const [loading, setLoading] = useState(false)

	const price = isFree ? 0 : selected.length * CARD_PRICE
	const canAfford = state && price <= state.money

	const handleConfirm = () => {
		setLoading(true)

		if (prelude) {
			api.send(pickPreludes(selected))
		} else {
			api.send(pickCards(selected))
		}
	}

	if (!game || !player) {
		return <>No game / player</>
	}

	return (
		<Modal
			open={true}
			allowClose={false}
			headerStyle={{ justifyContent: 'center' }}
			header={cardsLimit === 0 ? `Pick your cards` : `Pick ${cardsLimit} cards`}
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
					{!isFree
						? selected.length > 0
							? `Buy ${selected.length} cards for ${price}`
							: 'Buy nothing'
						: selected.length > 0
						? `Select ${selected.length}`
						: 'Select nothing'}
				</Button>
			}
			bodyStyle={{ display: 'flex', flexDirection: 'column' }}
		>
			<GameProgress>
				<ProgressItem>
					<Res>
						<FontAwesomeIcon icon={faTint} />
					</Res>
					<span>
						{game.oceans} / {game.map.oceans}
					</span>{' '}
				</ProgressItem>
				<ProgressItem>
					<Res>
						<FontAwesomeIcon icon={faThermometerHalf} />
					</Res>
					<span>
						{game.temperature * 2} / {game.map.temperature * 2}
					</span>{' '}
				</ProgressItem>
				<ProgressItem>
					<Res>
						O<sub>2</sub>
					</Res>
					<span>
						{game.oxygen} / {game.map.oxygen}
					</span>{' '}
				</ProgressItem>
			</GameProgress>

			<CardsContainer style={{ flex: 1 }}>
				{cardsToPick?.map(
					(c, i) =>
						c && (
							<PopInContainer
								key={i}
								style={{
									animationDelay: `${i * 350}ms`
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

const GameProgress = styled.div`
	display: flex;
	justify-content: center;
	margin-bottom: 0.5rem;
`

const ProgressItem = styled.div`
	display: flex;
	margin: 0 0.25rem;
	background-color: ${colors.background};
	border: 1px solid ${colors.border};

	> span {
		margin-left: 0.25rem;
		padding: 0.5rem;
	}
`

const Res = styled.div`
	background-color: ${colors.border};
	padding: 0.5rem;
`
