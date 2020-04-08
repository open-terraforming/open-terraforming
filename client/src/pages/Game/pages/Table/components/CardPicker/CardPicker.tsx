import { Button } from '@/components'
import { Modal } from '@/components/Modal/Modal'
import { useApi } from '@/context/ApiContext'
import { useAppStore } from '@/utils/hooks'
import { CardsLookupApi } from '@shared/cards'
import { CARD_PRICE } from '@shared/constants'
import { pickCards } from '@shared/index'
import React, { useState } from 'react'
import { CardsContainer } from '../CardsContainer/CardsContainer'
import { CardView } from '../CardView/CardView'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTint, faThermometerHalf } from '@fortawesome/free-solid-svg-icons'
import { colors } from '@/styles'

export const CardPicker = () => {
	const api = useApi()
	const player = useAppStore(state => state.game.player)
	const game = useAppStore(state => state.game.state)
	const state = player

	const cardsToPick = useAppStore(
		state => state.game.player?.cardsPick
	)?.map(c => CardsLookupApi.get(c))

	const [selected, setSelected] = useState([] as number[])

	const [loading, setLoading] = useState(false)

	const price = selected.length * CARD_PRICE
	const canAfford = state && price <= state.money

	const handleConfirm = () => {
		setLoading(true)
		api.send(pickCards(selected))
	}

	if (!game || !player) {
		return <>No game / player</>
	}

	return (
		<Modal
			open={true}
			allowClose={false}
			header={'Pick cards'}
			footer={
				<Button
					onClick={handleConfirm}
					disabled={loading || !canAfford}
					isLoading={loading}
				>
					{selected.length > 0
						? `Buy ${selected.length} cards for ${price}`
						: 'Buy nothing'}
				</Button>
			}
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

			<CardsContainer>
				{cardsToPick?.map(
					(c, i) =>
						c && (
							<CardView
								card={c}
								selected={selected.includes(i)}
								key={i}
								evaluate={false}
								onClick={
									!loading
										? () => {
												setSelected(
													selected.includes(i)
														? selected.filter(s => s !== i)
														: [...selected, i]
												)
										  }
										: undefined
								}
							/>
						)
				)}
			</CardsContainer>
		</Modal>
	)
}

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
