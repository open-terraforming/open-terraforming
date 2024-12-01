import { useAppStore } from '@/utils/hooks'
import { ReactNode } from 'react'
import { SomethingHappenedHeader } from './SomethingHappenedHeader'

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
			<span style={{ color: player?.color }}>{displayName}</span>
			{thing}
		</SomethingHappenedHeader>
	)
}
