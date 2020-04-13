import { useAppStore } from '@/utils/hooks'
import { CardEffectArgument } from '@shared/cards'
import React, { useEffect, useMemo, useState } from 'react'
import { ArgContainer } from './ArgContainer'
import { PlayerPicker } from './PlayerPicker'

type Props = {
	arg: CardEffectArgument
	onChange: (v: number) => void
}

export const PlayerArg = ({ arg, onChange }: Props) => {
	const gameState = useAppStore(state => state.game.state)
	const playerId = useAppStore(state => state.game.playerId)
	const playerState = useAppStore(state => state.game.player)

	const possiblePlayers = useMemo(
		() =>
			gameState && playerState
				? gameState.players.filter(
						p =>
							p.id !== playerId &&
							arg.playerConditions.every(c =>
								c.evaluate({
									player: p,
									game: gameState
								})
							)
				  )
				: [],
		[gameState, playerState]
	)

	const [value, setValue] = useState(
		arg.optional ? -1 : possiblePlayers[0]?.id || -1
	)

	useEffect(() => {
		onChange(value)
	}, [value])

	return (
		<ArgContainer>
			<span>{arg.descriptionPrefix || 'Target player'}</span>
			<PlayerPicker
				players={possiblePlayers}
				optional={arg.optional}
				playerId={value}
				onChange={playerId => setValue(playerId)}
				res={arg.resource || arg.production}
			/>
			<span>{arg.descriptionPostfix}</span>
		</ArgContainer>
	)
}
