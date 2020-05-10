import React from 'react'
import styled from 'styled-components'
import { colors } from '@/styles'
import { PlayerState } from '@shared/index'
import { resources, resourceProduction } from '@shared/cards/utils'
import { ResItem } from './ResItem'

type Props = {
	player: PlayerState
	onClick: () => void
}

export const Player = ({ player, onClick }: Props) => {
	return (
		<P onClick={onClick}>
			<Head>
				<Name>{player.name}</Name>
				<Cards>
					<CardCount>{player.cards.length}</CardCount>
					<CardLabel>in hand</CardLabel>
				</Cards>
				<Cards>
					<CardCount>{player.usedCards.length}</CardCount>
					<CardLabel>played</CardLabel>
				</Cards>
			</Head>
			<Info>
				{resources.map(r => (
					<ResItem
						key={r}
						res={r}
						value={player[r]}
						production={player[resourceProduction[r]]}
					/>
				))}
			</Info>
		</P>
	)
}

const P = styled.div`
	background: ${colors.background};
	border: 0.2rem solid ${colors.border};
	cursor: pointer;
	margin: 0.2rem 0.2rem;
`

const Head = styled.div`
	display: flex;
`

const Name = styled.div`
	padding: 0.2rem 0.5rem;
	flex: 1;
`

const Info = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
`

const Cards = styled.div`
	display: flex;
	text-transform: uppercase;
`

const CardCount = styled.div`
	border-left: 0.2rem solid ${colors.border};
	padding: 0 0.2rem;
	display: flex;
	align-items: center;
`

const CardLabel = styled.div`
	background-color: ${colors.border};
	padding: 0 0.2rem;
	font-size: 85%;
	display: flex;
	align-items: center;
`
