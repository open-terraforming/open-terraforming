import { ClippedBox } from '@/components/ClippedBox'
import { usePlayerState } from '@/utils/hooks'
import { SymbolType } from '@shared/cards'
import { GameEvent } from '@shared/index'
import { CSSProperties, ReactNode } from 'react'
import styled from 'styled-components'
import { SymbolDisplay } from '../../CardView/components/SymbolDisplay'
import { SymbolsEventLog } from './SymbolsEventLog'

type Props = {
	player: { id?: number; name: string; color: string }
	events: GameEvent[]
	prefix?: ReactNode
	style?: CSSProperties
	className?: string
}

export const PlayerWithEvents = ({
	player,
	events,
	prefix,
	style,
	className,
}: Props) => {
	const currentPlayerId = usePlayerState().id

	return (
		<PlayerContainer style={style} className={className}>
			<PlayerIcon>
				<SymbolDisplay
					symbol={{
						symbol: SymbolType.Player,
						color: player.color,
						title: player.id === currentPlayerId ? 'You' : player.name,
					}}
				/>
			</PlayerIcon>

			{prefix}

			{events.length > 0 && (
				<StyledLog
					events={events}
					currentPlayerId={player.id}
					noSpacing
					maxWidth="25rem"
				/>
			)}

			{events.length === 0 && <Nothing>Nothing</Nothing>}
		</PlayerContainer>
	)
}

const PlayerContainer = styled(ClippedBox)`
	margin: 0.5rem 0;

	.inner {
		display: flex;
	}
`

const PlayerIcon = styled.div`
	display: flex;
	align-items: center;
	padding: 0 0.5rem;
	background-color: ${({ theme }) => theme.colors.border};
`

const StyledLog = styled(SymbolsEventLog)`
	margin: 0.2rem 0.5rem;
`

const Nothing = styled.div`
	padding: 0.5rem;
	font-size: 125%;
	opacity: 0.5;
	text-transform: uppercase;
`
