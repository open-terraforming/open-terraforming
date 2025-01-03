import { Button } from '@/components'
import { Flex } from '@/components/Flex/Flex'
import { MinimizeIcon } from '@/components/MinimizeIcon'
import { Modal } from '@/components/Modal/Modal'
import { useApi } from '@/context/ApiContext'
import { useLocale } from '@/context/LocaleContext'
import { cardsToCardList } from '@/utils/cards'
import { useGameState, usePlayerState, useToggle } from '@/utils/hooks'
import { addCardResource } from '@shared/actions'
import { cardAcceptsResource } from '@shared/cards/conditions'
import { addCardResourceAction } from '@shared/player-actions'
import { useState } from 'react'
import { styled } from 'styled-components'
import { CardSelector } from '../../CardSelector/CardSelector'
import { CardView } from '../../CardView/CardView'
import { Symbols } from '../../CardView/components/Symbols'

type Props = {
	pendingAction: ReturnType<typeof addCardResourceAction>
	onClose: () => void
}

export const AddCardResourceModal = ({ pendingAction, onClose }: Props) => {
	const player = usePlayerState()
	const game = useGameState()
	const api = useApi()
	const [picking, togglePicking] = useToggle()
	const t = useLocale()

	const cards = cardsToCardList(
		player.usedCards,
		[cardAcceptsResource(pendingAction.data.cardResource)],
		{
			game,
			player,
		},
	)

	const [selected, setSelected] = useState(cards[0])

	const handleConfirm = () => {
		if (!selected) {
			return
		}

		api.send(addCardResource(selected.index))
	}

	const symbols = (
		<Symbols
			symbols={[
				{
					cardResource: pendingAction.data.cardResource,
					count: pendingAction.data.amount,
				},
			]}
		/>
	)

	return (
		<Modal
			open
			onClose={onClose}
			closeIcon={<MinimizeIcon />}
			footer={
				selected && (
					<ConfirmButton onClick={handleConfirm}>
						<Flex>
							Add {symbols} to {t.cards[selected?.card.code]}
						</Flex>
					</ConfirmButton>
				)
			}
		>
			<Flex justify="center">
				Add {symbols}
				to
			</Flex>

			{selected && (
				<CardView
					card={selected.card}
					onClick={togglePicking}
					hover={false}
					evaluateMode="static"
					player={player}
				/>
			)}

			<ChangeContainer justify="center">
				<Button onClick={togglePicking}>
					{selected ? 'Change' : 'Pick Card'}
				</Button>
			</ChangeContainer>

			{picking && (
				<CardSelector
					onSubmit={(selected) => {
						setSelected(selected[0])
						togglePicking()
					}}
					onClose={togglePicking}
					cards={cards}
					filters={false}
					limit={1}
				/>
			)}
		</Modal>
	)
}

const ConfirmButton = styled(Button)`
	padding: 0rem 1rem !important;
`

const ChangeContainer = styled(Flex)`
	margin: 1rem 0 1.5rem 0;
`
