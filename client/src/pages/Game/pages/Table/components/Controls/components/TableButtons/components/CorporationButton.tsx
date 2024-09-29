import { useState } from 'react'
import styled from 'styled-components'
import { usePlayerState } from '@/utils/hooks'
import { CardsLookupApi, CardType } from '@shared/cards'
import { CardsView } from '../../CardsView'
import { media } from '@/styles/media'
import { useLocale } from '@/context/LocaleContext'

type Props = {
	onClick: (defaultType?: CardType) => void
}

export const CorporationButton = ({ onClick }: Props) => {
	const locale = useLocale()
	const player = usePlayerState()
	const [opened, setOpened] = useState(false)

	const corporationState =
		player.usedCards.length > 0 ? player.usedCards[0] : undefined

	const corporation = corporationState
		? CardsLookupApi.get(player.corporation || corporationState.code)
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
			{locale.cards[corporation.code]}

			<CardsView
				cards={[player.usedCards[0]]}
				play
				open={opened}
				openable={
					!corporationState?.played && corporation.playEffects.length > 0
				}
			/>
		</Container>
	) : (
		<></>
	)
}

const Container = styled.div`
	cursor: pointer;
	padding: 0.2rem 1rem;
	background: ${({ theme }) => theme.colors.border};
	margin: 0 1rem;
	position: relative;

	display: flex;
	align-items: center;
	justify-content: center;

	width: 6rem;
	text-align: center;

	${media.medium} {
		display: none;
	}
`
