import React, { useState, useMemo, useEffect } from 'react'
import { CardEffectArgument, Resource } from '@shared/cards'
import { ArgContainer } from './ArgContainer'
import { useAppStore } from '@/utils/hooks'
import { ResourceInput } from './ResourceInput'
import { PlayerState } from '@shared/index'

type Props = {
	arg: CardEffectArgument
	onChange: (v: number | [number, number]) => void
}

export const PlayerResourceArg = ({ arg, onChange }: Props) => {
	const [amount, setAmount] = useState(0)
	const game = useAppStore(state => state.game.state)
	const playerId = useAppStore(state => state.game.playerId)

	const players = useMemo(
		() =>
			game
				? game.players.filter(
						p =>
							p.id !== playerId &&
							arg.playerConditions.every(c =>
								c.evaluate({
									game,
									player: p
								})
							)
				  )
				: [],
		[game, arg]
	)

	const [selectedPlayer, setSelectedPlayer] = useState(
		players[0] as PlayerState | undefined
	)

	useEffect(() => {
		onChange([selectedPlayer ? selectedPlayer.id : -1, amount])
	}, [selectedPlayer, amount])

	if (!game) {
		return <>No player / game</>
	}

	return (
		<ArgContainer>
			<span>{arg.descriptionPrefix}</span>
			<select
				value={selectedPlayer ? selectedPlayer.id : -1}
				onChange={e => {
					const index = parseInt(e.target.value, 10)
					setSelectedPlayer(game.players.find(p => p.id === index))
				}}
			>
				<option value={-1}>Nobody</option>
				{players.map(p => (
					<option key={p.id} value={p.id}>
						{p.name} (has {p[arg.resource as Resource]})
					</option>
				))}
			</select>
			{selectedPlayer && (
				<ResourceInput
					res={arg.resource as Resource}
					max={Math.min(
						arg.maxAmount || selectedPlayer[arg.resource as Resource],
						selectedPlayer[arg.resource as Resource]
					)}
					onChange={v => setAmount(v)}
				/>
			)}
			<span>{arg.descriptionPostfix}</span>
		</ArgContainer>
	)
}
