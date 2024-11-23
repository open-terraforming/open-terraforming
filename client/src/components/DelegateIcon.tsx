import { useAppStore } from '@/utils/hooks'
import { faUser, faUserTie } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CSSProperties } from 'react'
import styled, { css } from 'styled-components'

type DelegateType = 'delegate' | 'party-leader' | 'chairman'

type Props = {
	playerId?: number | null
	className?: string
	style?: CSSProperties
	type?: DelegateType
}

export const DelegateIcon = ({
	playerId,
	className,
	style,
	type = 'delegate',
}: Props) => {
	const playerMap = useAppStore((store) => store.game.playerMap)
	const player = playerId ? playerMap[playerId] : null

	const icon = type !== 'chairman' ? faUser : faUserTie

	return (
		<Container
			$type={type}
			className={className}
			title={player?.name ?? 'Neutral delegate'}
			style={{
				color: player?.color ?? '#aaa',
				...style,
			}}
		>
			<FontAwesomeIcon icon={icon} />
		</Container>
	)
}

const Container = styled.div<{ $type: DelegateType }>`
	filter: drop-shadow(0 0 2px #222);

	${({ $type }) =>
		$type !== 'delegate' &&
		css`
			background-color: #000;
			padding: 0.2rem;
			border-radius: 25%;
		`}
`
