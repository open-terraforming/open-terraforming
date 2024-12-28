import { Button, Message } from '@/components'
import { MinimizeIcon } from '@/components/MinimizeIcon'
import { Modal } from '@/components/Modal/Modal'
import { useApi } from '@/context/ApiContext'
import { useAppStore, useGameState, usePlayerState } from '@/utils/hooks'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { pickStarting } from '@shared/actions'
import { CardsLookupApi } from '@shared/cards'
import { PlayerActionType } from '@shared/player-actions'
import { simulateCardEffects } from '@shared/utils/simulate-card-effects'
import { simulateCardPassiveEffectsOnStart } from '@shared/utils/simulateCardPassiveEffectsOnStart'
import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { CardPicker, PickerType } from '../CardPicker/CardPicker'
import { CardView } from '../CardView/CardView'
import { CorporationPicker } from '../CorporationPicker/CorporationPicker'
import { MiniCardView } from '../MiniCardView/MiniCardView'

type Props = {
	open: boolean
	onClose: () => void
}

enum Section {
	Corporation,
	Cards,
	Preludes,
}

export const StartPicker = ({ open, onClose }: Props) => {
	const api = useApi()
	const pendingAction = useAppStore((state) => state.game.pendingAction)
	const game = useGameState()
	const player = usePlayerState()

	const [loading, setLoading] = useState(false)

	const [corporation, setCorporation] = useState(
		undefined as string | undefined,
	)

	const [cards, setCards] = useState([] as number[])
	const [preludes, setPreludes] = useState([] as number[])

	const [modal, setModal] = useState(undefined as Section | undefined)

	const availableMoney = useMemo(() => {
		if (!corporation) {
			return 40
		}

		const detail = CardsLookupApi.get(corporation)
		const { player } = simulateCardEffects(corporation, detail.playEffects)

		return player.money
	}, [corporation])

	const sponsorCost = useMemo(() => {
		if (!corporation) {
			return 40
		}

		const detail = CardsLookupApi.get(corporation)

		const { player } = simulateCardPassiveEffectsOnStart(
			corporation,
			detail.passiveEffects,
		)

		return player.sponsorCost ?? game.cardPrice
	}, [corporation])

	const handlePicker = (type: Section) => () => {
		setModal(type)
	}

	const handleModalClose = () => {
		setModal(undefined)
	}

	const handleDone = () => {
		if (!corporation) {
			return
		}

		setLoading(true)
		api.send(pickStarting(corporation, cards, preludes))
	}

	if (pendingAction?.type !== PlayerActionType.PickStarting) {
		return <></>
	}

	const affordable = sponsorCost <= availableMoney

	const hasPreludes =
		preludes.length > 0 || !game.prelude || pendingAction.preludes.length === 0

	const hasCorporation = !!corporation

	const canContinue = affordable && hasCorporation && hasPreludes

	return (
		<Modal
			open={open}
			onClose={onClose}
			closeIcon={<MinimizeIcon />}
			header={<h2>Starting hand</h2>}
			footerStyle={{ justifyContent: 'center' }}
			footer={
				<Button
					onClick={handleDone}
					disabled={loading || !canContinue}
					isLoading={loading}
					icon={faCheck}
				>
					{"I'm ready"}
				</Button>
			}
		>
			<PickItems>
				<PickItem>
					<PickItemLabel>Corporation</PickItemLabel>
					<PickItemValue>
						{corporation && (
							<CardView
								card={CardsLookupApi.get(corporation)}
								hover={false}
								evaluateMode="static"
								player={player}
							/>
						)}
					</PickItemValue>

					<Button onClick={handlePicker(Section.Corporation)}>
						{corporation ? 'Change corporation' : 'Pick corporation'}
					</Button>
				</PickItem>

				<PickItem>
					<PickItemLabel>Starting projects</PickItemLabel>
					<PickItemValue>
						{!affordable && (
							<Message
								message={`You don't have enough money to sponsor ${cards.length} projects.`}
								type="error"
							/>
						)}

						{cards.length > 0 && (
							<PickCardsContainer>
								{cards.map((p) => (
									<MiniCardView key={p} card={pendingAction.cards[p]} />
								))}
							</PickCardsContainer>
						)}
					</PickItemValue>

					<Button onClick={handlePicker(Section.Cards)}>Pick projects</Button>
				</PickItem>

				{game.prelude && (
					<PickItem>
						<PickItemLabel>Preludes</PickItemLabel>
						<PickItemValue>
							{preludes.length > 0 && (
								<PickCardsContainer>
									{preludes.map((p) => (
										<MiniCardView
											key={p}
											card={pendingAction.preludes[p]}
											extended
										/>
									))}
								</PickCardsContainer>
							)}
						</PickItemValue>

						<Button onClick={handlePicker(Section.Preludes)}>
							Pick preludes
						</Button>
					</PickItem>
				)}
			</PickItems>

			{modal === Section.Corporation && (
				<CorporationPicker
					corporations={pendingAction.corporations}
					onClose={handleModalClose}
					onSelect={(corp) => {
						setCorporation(corp)
						handleModalClose()
					}}
				/>
			)}

			{modal === Section.Cards && (
				<CardPicker
					type={PickerType.Cards}
					cards={pendingAction.cards}
					moneyOverride={availableMoney}
					overrideCardPrice={sponsorCost}
					closeable
					selected={cards}
					onClose={handleModalClose}
					onSelect={(c) => {
						setCards(c)
						handleModalClose()
					}}
				/>
			)}

			{modal === Section.Preludes && (
				<CardPicker
					type={PickerType.Preludes}
					cards={pendingAction.preludes}
					limit={pendingAction.preludesLimit}
					free
					closeable
					onClose={handleModalClose}
					onSelect={(p) => {
						setPreludes(p)
						handleModalClose()
					}}
				/>
			)}
		</Modal>
	)
}

const PickItems = styled.div`
	display: flex;
	min-height: 0;
	min-width: 0;
	overflow: auto;
	flex-wrap: wrap;
`

const PickItem = styled.div`
	min-width: 300px;
	flex: 1;
	margin: 0.5rem 2rem;
	min-height: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
`

const PickItemLabel = styled.div``

const PickItemValue = styled.div`
	margin: 1rem 0;
	display: flex;
	flex-direction: column;
	align-items: center;
`

const PickCardsContainer = styled.div``
