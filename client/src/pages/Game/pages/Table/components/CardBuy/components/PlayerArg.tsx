import React, { useMemo, useState, useEffect } from 'react'
import { CardEffectArgument } from '@shared/cards'
import { useAppStore } from '@/utils/hooks'
import { UsedCardState } from '@shared/index'
import { ArgContainer } from './ArgContainer'

type Props = {
	arg: CardEffectArgument
	onChange: (v: number) => void
}

export const PlayerArg = ({ arg, onChange }: Props) => {
	const gameState = useAppStore(state => state.game.state)
	const playerId = useAppStore(state => state.game.playerId)
	const playerState = useAppStore(state => state.game.player?.gameState)

	const [value, setValue] = useState(-1)

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = parseInt(e.target.value, 10)
		setValue(value)
		onChange(value)
	}

	useEffect(() => {
		onChange(value)
	}, [])

	const possiblePlayers = useMemo(
		() =>
			gameState && playerState
				? gameState.players.filter(
						p =>
							p.id !== playerId &&
							arg.playerConditions.every(c =>
								c.evaluate({
									player: p.gameState,
									game: gameState
								})
							)
				  )
				: [],
		[gameState, playerState]
	)

	return (
		<ArgContainer>
			<span>{arg.descriptionPrefix || 'Target player'}</span>
			<select value={value} onChange={handleChange}>
				{arg.optional && <option value={-1}>Nobody</option>}
				{possiblePlayers.map(p => (
					<option key={p.id} value={p.id}>
						{p.name}
					</option>
				))}
			</select>
			<span>{arg.descriptionPostfix}</span>
		</ArgContainer>
	)
}
