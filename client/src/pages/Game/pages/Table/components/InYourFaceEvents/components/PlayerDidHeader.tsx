import { useAppStore } from '@/utils/hooks'
import { ReactNode } from 'react'
import { css, styled } from 'styled-components'

type Props = {
	playerId: number
	thing: ReactNode
	noSpacing?: boolean
}

export const PlayerDidHeader = ({ playerId, thing, noSpacing }: Props) => {
	const players = useAppStore((state) => state.game.playerMap)
	const player = players[playerId]

	return (
		<Header $noSpacing={noSpacing}>
			<span style={{ color: player.color }}>{player.name}</span>
			{thing}
		</Header>
	)
}

const Header = styled.div<{ $noSpacing?: boolean }>`
	text-align: center;
	${({ $noSpacing }) =>
		!$noSpacing &&
		css`
			margin: 0.25rem 0 1rem 0;
		`}
`
