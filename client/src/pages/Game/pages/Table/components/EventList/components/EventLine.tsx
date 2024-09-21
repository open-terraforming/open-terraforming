import { useAppStore, useToggle } from '@/utils/hooks'
import { CardsLookupApi, Resource } from '@shared/cards'
import { Competitions } from '@shared/competitions'
import { ColonyState, PlayerState, StandardProjectType } from '@shared/index'
import { Milestones } from '@shared/milestones'
import { otherToStr, tileToStr } from '@shared/texts'
import { withUnits } from '@shared/units'
import { ucFirst } from '@shared/utils'
import { lighten } from 'polished'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { EventType, GameEvent } from '../types'
import { CardModal } from './CardModal'
import { useLocale } from '@/context/LocaleContext'
import { assertNever } from '@shared/utils/assertNever'
import { quantized } from '@shared/utils/quantized'
import { ColoniesModal } from '../../ColoniesModal/ColoniesModal'
import { ResourceIcon } from '../../ResourceIcon/ResourceIcon'
import { CardResourceIcon } from '../../CardResourceIcon/CardResourceIcon'

type Props = {
	event: GameEvent
	animated: boolean
	onDone?: () => void
}

const PlayerSpan = ({ player }: { player: PlayerState }) => (
	<span style={{ color: player && lighten(0.2, player.color) }}>
		{player?.name}
	</span>
)

const CardSpan = memo(({ card }: { card: string }) => {
	const locale = useLocale()
	const [shown, setShown] = useState(false)

	return (
		<>
			{shown && <CardModal card={card} onClose={() => setShown(false)} />}
			<CardSpanE onClick={() => setShown(true)}>
				{locale.cards[CardsLookupApi.get(card).code]}
			</CardSpanE>
		</>
	)
})

const ColonySpan = ({ colony }: { colony: ColonyState }) => {
	const locale = useLocale()
	const [shown, toggleShow] = useToggle()

	return (
		<>
			{shown && <ColoniesModal onClose={toggleShow} />}
			<ColoniesSpanE onClick={toggleShow}>
				{locale.colonies[colony.code]}
			</ColoniesSpanE>
		</>
	)
}

export const EventLine = ({ event, animated, onDone }: Props) => {
	const locale = useLocale()
	const players = useAppStore((state) => state.game.playerMap)
	const game = useAppStore((state) => state.game.state)
	const doneRef = useRef(onDone)
	doneRef.current = onDone

	useEffect(() => {
		if (animated) {
			setTimeout(() => {
				doneRef.current?.()
			}, 7000)
		}
	}, [])

	const content = useMemo(() => {
		switch (event.type) {
			case EventType.CardPlayed:
				return (
					<>
						<PlayerSpan player={players[event.playerId]} /> bought{' '}
						<CardSpan card={event.card} />
					</>
				)
			case EventType.CardUsed:
				return (
					<>
						<PlayerSpan player={players[event.playerId]} /> played{' '}
						<CardSpan card={event.card} />
					</>
				)
			case EventType.CardsReceived:
				return (
					<>
						<PlayerSpan player={players[event.playerId]} />
						{` got ${event.amount} cards`}
					</>
				)
			case EventType.RatingChanged:
				return (
					<>
						<PlayerSpan player={players[event.playerId]} />
						{` + ${event.amount} TR`}
					</>
				)
			case EventType.CorporationPicked:
				return (
					<>
						<PlayerSpan player={players[event.playerId]} />
						{` picked ${
							locale.cards[CardsLookupApi.get(event.corporation).code]
						}`}
					</>
				)
			case EventType.ResourcesChanged:
				return (
					<>
						<PlayerSpan player={players[event.playerId]} />
						{Object.entries(event.resources).map(([resource, amount], i) => (
							<ResourceE positive={amount > 0} key={i}>
								{amount > 0 ? ' +' : ' -'}
								{Math.abs(amount)}
								<ResourceIcon key={i} res={resource as Resource} />
							</ResourceE>
						))}
					</>
				)
			case EventType.ProductionChanged:
				return (
					<>
						<PlayerSpan player={players[event.playerId]} />
						<ResourceE positive={event.amount > 0}>
							{event.amount > 0 ? ' +' : ' -'}
							{Math.abs(event.amount)}
							<ResourceIcon
								res={event.resource as Resource}
								production
								fixedHeight
							/>
						</ResourceE>
					</>
				)
			case EventType.TilePlaced:
				const player = players[event.playerId]

				return (
					<>
						{player && <PlayerSpan player={players[event.playerId]} />}
						{!player && 'World government'}
						{' placed '}
						<CardSpanE>
							{event.other !== undefined && event.other !== null
								? otherToStr(event.other)
								: tileToStr(event.tile)}
						</CardSpanE>
					</>
				)
			case EventType.CompetitionSponsored:
				return (
					<>
						<PlayerSpan player={players[event.playerId]} />
						{` sponsored ${Competitions[event.competition].title} competition`}
					</>
				)
			case EventType.MilestoneBought:
				return (
					<>
						<PlayerSpan player={players[event.playerId]} />
						{` bought ${Milestones[event.milestone].title} milestone`}
					</>
				)
			case EventType.GameProgressChanged:
				return (
					<>
						{ucFirst(event.progress)}
						{event.amount > 0 ? ' +' : ' -'}
						<ResourceE positive={event.amount > 0}>
							{withUnits(event.progress, Math.abs(event.amount))}
						</ResourceE>
					</>
				)
			case EventType.CardResourceChanged:
				return (
					<>
						<PlayerSpan player={players[event.playerId]} />{' '}
						<CardResourceE positive={event.amount > 0}>
							{event.amount > 0 ? '+' : '-'}
							{Math.abs(event.amount)}
							<CardResourceIcon res={event.resource} fixedHeight />
						</CardResourceE>
						{event.amount > 0 ? ' to ' : ' from '}
						<CardSpan card={event.card} />
					</>
				)
			case EventType.ColonyActivated:
				return (
					<>
						<ColonySpan colony={game.colonies[event.colony]} /> activated
					</>
				)
			case EventType.ColonyBuilt:
				return (
					<>
						<PlayerSpan player={players[event.playerId]} /> built colony on{' '}
						<ColonySpan colony={game.colonies[event.colony]} />
					</>
				)
			case EventType.ColonyTrading:
				return (
					<>
						<PlayerSpan player={players[event.playerId]} /> traded with{' '}
						<ColonySpan colony={game.colonies[event.colony]} />
					</>
				)
			case EventType.ColonyTradingStepChanged:
				return (
					<>
						<ColonySpan colony={game.colonies[event.colony]} />:{' '}
						{event.change > 0 ? '+' : ''}
						{quantized(event.change, 'income step', 'income steps')}
					</>
				)
			case EventType.PlayerTradeFleetsChange:
				return (
					<>
						<PlayerSpan player={players[event.playerId]} />{' '}
						{event.amount > 0 ? 'acquired extra' : 'lost'}{' '}
						{Math.abs(event.amount)} trade fleets
					</>
				)
			case EventType.NewGeneration:
				return <PhaseSpanE>{event.generation}. generation started</PhaseSpanE>
			case EventType.PlayingChanged:
				return (
					<>
						<PlayerSpan player={game.players[event.playing]} /> is playing
					</>
				)
			case EventType.ProductionPhase:
				return <PhaseSpanE>Production phase</PhaseSpanE>
			case EventType.StandardProjectBought:
				return (
					<>
						<PlayerSpan player={players[event.playerId]} /> bought{' '}
						{StandardProjectType[event.project]}
					</>
				)
			case EventType.TileAcquired:
				return (
					<>
						<PlayerSpan player={players[event.playerId]} /> is building{' '}
						{tileToStr(event.tile)}
					</>
				)
			case EventType.TileClaimed:
				return (
					<>
						<PlayerSpan player={players[event.playerId]} /> claimed tile
					</>
				)
			case EventType.StartingSetup:
				return <></>
			case EventType.ProductionDone:
				return <></>
		}

		assertNever(event)
	}, [event, players])

	return <E animation={animated}>{content}</E>
}

const E = styled.div<{ animation: boolean }>`
	overflow: hidden;

	${(props) =>
		props.animation &&
		css`
			animation-name: ${Animation};
			animation-duration: 7000ms;
			animation-fill-mode: forwards;
		`}
`

const Animation = keyframes`
	0% { transform: translate(0, -100px); opacity: 0; }
	10% { transform: translate(0, 0); opacity: 1; }
	90% { transform: translate(0, 0) scaleY(1); opacity: 1; max-height: 50px; }
	100% { transform: translate(-300px, 0) scaleY(0); opacity: 0; max-height: 0; }
`

const CardSpanE = styled.span`
	color: #91c8ff;
	cursor: pointer;

	&:hover {
		text-decoration: underline;
	}
`

const PhaseSpanE = styled.span`
	color: #f5af7c;
`

const ResourceE = styled.span<{ positive: boolean }>`
	display: inline-flex;
	margin: 0 0.25rem;
	gap: 0.2rem;
	color: ${(props) => (props.positive ? '#86F09B' : '#F5AF7C')};
`

const CardResourceE = styled.span<{ positive: boolean }>`
	display: inline-flex;
	margin: 0 0.25rem;
	gap: 0.2rem;
	color: ${(props) => (props.positive ? '#86F09B' : '#F5AF7C')};
`

const ColoniesSpanE = styled.span`
	cursor: pointer;
	color: #e46868;

	&:hover {
		text-decoration: underline;
	}
`
