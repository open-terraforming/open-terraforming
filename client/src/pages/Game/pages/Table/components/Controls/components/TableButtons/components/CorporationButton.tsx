import React, { useState } from 'react'
import styled from 'styled-components'
import { colors } from '@/styles'
import { usePlayerState } from '@/utils/hooks'
import { CardsLookupApi, CardType } from '@shared/cards'
import { CardsView } from '../../CardsView'

type Props = {
	onClick: (defaultType?: CardType) => void
}

export const CorporationButton = ({ onClick }: Props) => {
	const player = usePlayerState()
	const [opened, setOpened] = useState(false)

	const corporation =
		player.usedCards.length > 0
			? CardsLookupApi.get(player.corporation || player.usedCards[0].code)
			: undefined

	const handleClick = () => {
		onClick(CardType.Corporation)
	}

	return corporation ? (
		<Container
			onClick={handleClick}
			onMouseOver={() => setOpened(true)}
			onMouseLeave={() => setOpened(false)}
		>
			{corporation?.title}

			<CardsView
				cards={[
					{
						state: player.usedCards[0],
						cardIndex: 0
					}
				]}
				play
				open={opened}
				openable={false}
			/>
		</Container>
	) : (
		<></>
	)
}

const Container = styled.div`
	cursor: pointer;
	padding: 0.2rem 1rem;
	background: ${colors.border};
	margin: 0 1rem;
	position: relative;

	display: flex;
	align-items: center;
	justify-content: center;

	width: 6rem;
	text-align: center;
`
