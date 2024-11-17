import { useAppStore } from '@/utils/hooks'
import { faUserTie } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CSSProperties } from 'react'

type Props = {
	playerId?: number | null
	className?: string
	style?: CSSProperties
}

export const DelegateIcon = ({ playerId, className, style }: Props) => {
	const playerMap = useAppStore((store) => store.game.playerMap)
	const player = playerId ? playerMap[playerId] : null

	return (
		<div
			className={className}
			title={player?.name ?? 'Neutral delegate'}
			style={{
				color: player?.color ?? '#aaa',
				...style,
			}}
		>
			<FontAwesomeIcon icon={faUserTie} />
		</div>
	)
}
