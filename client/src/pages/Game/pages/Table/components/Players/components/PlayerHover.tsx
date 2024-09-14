import { Portal } from '@/components'
import { useLocale } from '@/context/LocaleContext'
import { CardCategory, CardsLookupApi, CardType, Resource } from '@shared/cards'
import { PLAYER_RESOURCE_TO_PRODUCTION, PlayerState } from '@shared/index'
import styled, { css, keyframes } from 'styled-components'
import { Tag } from '../../CardView/components/Tag'
import { ResourceIcon } from '../../ResourceIcon/ResourceIcon'
import { optionalAnimation } from '@/styles/optionalAnimation'

type Props = {
	player: PlayerState
	x: number
	y: number
}

export const PlayerHover = ({ player, x, y }: Props) => {
	const t = useLocale()

	const actionCards = player.usedCards.filter((c) => {
		const info = CardsLookupApi.get(c.code)

		return info.type === CardType.Action && info.actionEffects.length > 0
	}).length

	const eventCards = player.usedCards.filter((c) => {
		const info = CardsLookupApi.get(c.code)

		return info.type === CardType.Event
	}).length

	const tagsWithCount = Array.from(
		player.usedCards
			.map((c) => CardsLookupApi.get(c.code))
			.filter((c) => c.type !== CardType.Event)
			.reduce((acc, c) => {
				c.categories.forEach((t) => {
					const prev = acc.get(t) ?? 0
					acc.set(t, prev + 1)
				})

				return acc
			}, new Map<CardCategory, number>())
			.entries(),
	).sort(([a], [b]) => a - b)

	return (
		<Portal>
			<Container style={{ left: x, top: y }}>
				<Title>{t.cards[player.corporation]}</Title>

				<Resources>
					<ResItem player={player} resource="money" />
					<ResItem player={player} resource="ore" />
					<ResItem player={player} resource="titan" />
					<ResItem player={player} resource="plants" />
					<ResItem player={player} resource="energy" />
					<ResItem player={player} resource="heat" />
				</Resources>
				<TagInfo>
					<TagsContainer>
						{tagsWithCount.map(([tag, count]) => (
							<TagItem key={tag}>
								{count} <Tag tag={tag} size="sm" />
							</TagItem>
						))}
					</TagsContainer>
				</TagInfo>
				<Info>
					<InfoItem>{player.cards.length} in hand</InfoItem>
					<InfoItem>{player.usedCards.length} on table</InfoItem>
					<InfoItem>{actionCards} actions</InfoItem>
					<InfoItem>{eventCards} events</InfoItem>
				</Info>
			</Container>
		</Portal>
	)
}

type ResItemProps = {
	resource: Resource
	player: PlayerState
}

const ResItem = ({ resource, player }: ResItemProps) => {
	const production = player[PLAYER_RESOURCE_TO_PRODUCTION[resource]]

	return (
		<ResItemC>
			<ResItemV>
				{player[resource]} <ResourceIcon res={resource} />
			</ResItemV>
			<ResItemP>
				{production >= 0 && '+'}
				{production}
			</ResItemP>
		</ResItemC>
	)
}

const Resources = styled.div`
	display: flex;
`

const Info = styled.div`
	display: flex;
	border-right: 0.2rem solid ${({ theme }) => theme.colors.border};
	justify-content: center;
	border-top: 0.2rem solid ${({ theme }) => theme.colors.border};
`

const InfoItem = styled.div`
	border-right: 0.2rem solid ${({ theme }) => theme.colors.border};
	padding: 0.1rem 0.2rem;
	background-color: ${({ theme }) => theme.colors.background};

	&:first-child {
		/*border-left: 0.2rem solid ${({ theme }) => theme.colors.border};*/
	}

	&:last-child {
		border-right: none;
	}
`

const PopIn = keyframes`
	0% { transform: translate(-10%, 0); opacity: 0; }
	100% { transform: translate(0, 0); opacity: 1; }
`

const Container = styled.div`
	position: absolute;
	left: 100%;
	background: ${({ theme }) => theme.colors.background};
	border: 0.2rem solid ${({ theme }) => theme.colors.border};
	border-right: none;

	${optionalAnimation(css`
		animation-name: ${PopIn};
		animation-duration: 0.2s;
		animation-iteration-count: 1;
	`)}
`

const ResItemC = styled.div`
	width: 3rem;
	text-align: center;
	border-right: 0.2rem solid ${({ theme }) => theme.colors.border};
`

const ResItemP = styled.div`
	background: ${({ theme }) => theme.colors.border};
	padding: 0.1rem;
`

const ResItemV = styled.div`
	padding: 0.1rem;
	font-size: 110%;
`

const TagInfo = styled.div`
	border-top: 0.2rem solid ${({ theme }) => theme.colors.border};
	border-right: 0.2rem solid ${({ theme }) => theme.colors.border};
`

const TagsContainer = styled.div`
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	max-width: 18rem;
	margin: 0 auto;
`

const TagItem = styled.div`
	display: flex;
	align-items: center;
	gap: 0.1rem;
	padding: 0.2rem 0.1rem;
`

const Title = styled.div`
	text-align: center;
	background: ${({ theme }) => theme.colors.border};
	padding: 0.2rem;
`
