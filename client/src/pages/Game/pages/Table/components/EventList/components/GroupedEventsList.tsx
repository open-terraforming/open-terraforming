import { Box } from '@/components/Box'
import { formatTime } from '@/utils/formatTime'
import { useAppStore, useGameState, usePlayerState } from '@/utils/hooks'
import { GameEvent } from '@shared/index'
import { useMemo } from 'react'
import styled from 'styled-components'
import { InYourFaceEventTitle } from '../../InYourFaceEvents/components/InYourFaceEventTitle'
import { isInYourFaceEvent } from '../../InYourFaceEvents/utils/isInYourFaceEvent'
import { lighten } from 'polished'

type Props = {
	onClick: (e: GameEvent) => void
}

export const GroupedEventsList = ({ onClick }: Props) => {
	const game = useGameState()
	const player = usePlayerState()
	const events = useAppStore((store) => store.game.events)

	const allEvents = useMemo(
		() =>
			events.filter((event) => {
				return (
					(!('playerId' in event) || event.playerId !== player.id) &&
					isInYourFaceEvent({ event })
				)
			}),
		[events],
	)

	const allEventsReversed = useMemo(() => [...allEvents].reverse(), [allEvents])

	const gameStart = new Date(game.started)

	return allEventsReversed.map((e, i) => (
		<Line key={i} onClick={() => onClick(e)}>
			<Timestamp>{formatTime(e.t - gameStart.getTime())}</Timestamp>
			<InYourFaceEventTitle event={e} />
		</Line>
	))
}

const Timestamp = styled.div`
	width: 4rem;
	text-align: right;
	margin-right: 0.25rem;
`

const Line = styled(Box)`
	cursor: pointer;

	&:hover {
		background-color: ${({ theme }) => lighten(0.1, theme.colors.background)};
	}
`
