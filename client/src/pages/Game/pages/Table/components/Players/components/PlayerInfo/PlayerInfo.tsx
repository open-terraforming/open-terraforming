import { Modal } from '@/components/Modal/Modal'
import { cardsToCardList } from '@/utils/cards'
import { useAppStore } from '@/utils/hooks'
import { useMemo } from 'react'
import styled from 'styled-components'
import { CardDisplay } from '../../../CardDisplay/CardDisplay'
import { ResourceIcon } from '../../../ResourceIcon/ResourceIcon'
import { Resource } from '@shared/cards'

type Props = {
	playerId: number
	onClose: () => void
}

const ResItem = ({
	res,
	value,
	production,
}: {
	res: Resource
	value: number
	production: number
}) => (
	<InfoItem>
		<Value>
			{value} <ResourceIcon res={res} />
		</Value>
		<Production>
			{production > 0 && '+'}
			{production}
		</Production>
	</InfoItem>
)

export const PlayerInfo = ({ playerId, onClose }: Props) => {
	const player = useAppStore((state) =>
		state.game.state?.players.find((p) => p.id === playerId),
	)

	const state = player
	const usedCards = player?.usedCards

	const cards = useMemo(
		() => (usedCards ? cardsToCardList(usedCards) : []),
		[usedCards],
	)

	if (!player || !state) {
		return <>No player</>
	}

	return (
		<Modal
			open={true}
			onClose={onClose}
			header={`${player.name}`}
			contentStyle={{ minWidth: '80%' }}
			bodyStyle={{ display: 'flex', flexDirection: 'column' }}
		>
			<Info>
				<ResItem
					res="money"
					value={state.money}
					production={state.moneyProduction}
				/>
				<ResItem res="ore" value={state.ore} production={state.oreProduction} />
				<ResItem
					res="titan"
					value={state.titan}
					production={state.titanProduction}
				/>
				<ResItem
					res="plants"
					value={state.plants}
					production={state.plantsProduction}
				/>
				<ResItem
					res="energy"
					value={state.energy}
					production={state.energyProduction}
				/>
				<ResItem
					res="heat"
					value={state.heat}
					production={state.heatProduction}
				/>
				<InfoItem>
					<Value>Cards in hand</Value>
					<Production>{state.cards.length}</Production>
				</InfoItem>
				<InfoItem>
					<Value>On table</Value>
					<Production>{state.usedCards.length}</Production>
				</InfoItem>
			</Info>

			<CardDisplay
				cards={cards}
				hover={false}
				onSelect={() => {
					void 0
				}}
				selected={[]}
				player={player}
				evaluateMode="viewing"
			/>
		</Modal>
	)
}

const Info = styled.div`
	display: flex;
	flex-wrap: wrap;
	margin-bottom: 1rem;
	justify-content: center;
`

const InfoItem = styled.div`
	display: flex;
	margin: 0 0.25rem;
	background-color: ${({ theme }) => theme.colors.background};
	border: 1px solid ${({ theme }) => theme.colors.border};
`

const Value = styled.div`
	padding: 0.5rem;
	width: 100%;
`

const Production = styled.div`
	background-color: ${({ theme }) => theme.colors.border};
	padding: 0.5rem;
`
