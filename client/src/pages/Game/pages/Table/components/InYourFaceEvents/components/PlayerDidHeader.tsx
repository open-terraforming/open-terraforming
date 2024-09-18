import { useAppStore } from '@/utils/hooks'
import { ReactNode } from 'react'
import { styled } from 'styled-components'

type Props = {
	playerId: number
	thing: ReactNode
}

export const PlayerDidHeader = ({ playerId, thing }: Props) => {
	const players = useAppStore((state) => state.game.playerMap)
	const player = players[playerId]

	return (
		<Header>
			<span style={{ color: player.color }}>{player.name}</span>
			{thing}
		</Header>
	)
}

const Header = styled.div`
	text-align: center;
	margin: 0.25rem 0 1rem 0;
`
