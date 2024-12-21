import { useAppStore } from '@/utils/hooks'
import { ReactNode } from 'react'
import { SomethingHappenedHeader } from './SomethingHappenedHeader'
import { lighten } from 'polished'

type Props = {
	playerId: number
	thing: ReactNode
	noSpacing?: boolean
}

export const PlayerDidHeader = ({ playerId, thing, noSpacing }: Props) => {
	const players = useAppStore((state) => state.game.playerMap)
	const currentPlayerId = useAppStore((state) => state.game.playerId)
	const player = players[playerId]

	const displayName =
		(playerId === currentPlayerId ? 'You' : player?.name) ?? 'Unknown player'

	return (
		<SomethingHappenedHeader $noSpacing={noSpacing}>
			<span
				style={{
					color: player?.color ? lighten(0.2, player.color) : undefined,
				}}
			>
				{displayName}
			</span>
			{thing}
		</SomethingHappenedHeader>
	)
}
