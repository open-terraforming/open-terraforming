import { Button } from '@/components'
import { Modal } from '@/components/Modal/Modal'
import { useApi } from '@/context/ApiContext'
import { cardsToCardList } from '@/utils/cards'
import { useGameState, usePlayerState, useToggle } from '@/utils/hooks'
import { addCardResource } from '@shared/actions'
import { cardAcceptsResource } from '@shared/cards/conditions'
import { addCardResourceAction } from '@shared/player-actions'
import { useState } from 'react'
import { CardInfo } from '../../CardDisplay/CardDisplay'
import { CardSelector } from '../../CardSelector/CardSelector'
import { useLocale } from '@/context/LocaleContext'
import { CardView } from '../../CardView/CardView'
import { Symbols } from '../../CardView/components/Symbols'
import { Flex } from '@/components/Flex/Flex'
import { styled } from 'styled-components'

type Props = {
	pendingAction: ReturnType<typeof addCardResourceAction>
}

export const AddCardResourceModal = ({ pendingAction }: Props) => {
	const player = usePlayerState()
	const game = useGameState()
	const api = useApi()
	const [picking, togglePicking] = useToggle()
	const [selected, setSelected] = useState(undefined as CardInfo | undefined)
	const t = useLocale()

	const cards = cardsToCardList(
		player.usedCards,
		[cardAcceptsResource(pendingAction.data.cardResource)],
		{
			game,
			player,
		},
	)

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
			hideClose
			allowClose={false}
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
				<CardView card={selected.card} onClick={togglePicking} hover={false} />
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
