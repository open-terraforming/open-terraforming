import React, { useState, useMemo, useEffect } from 'react'
import { CardEffectArgument, Resource } from '@shared/cards'
import { ArgContainer } from './ArgContainer'
import { useAppStore } from '@/utils/hooks'
import { ResourceInput } from './ResourceInput'
import { PlayerState, UsedCardState } from '@shared/index'
import { PlayerPicker } from './PlayerPicker'

type Props = {
	arg: CardEffectArgument
	card: UsedCardState
	onChange: (v: number | [number, number]) => void
}

export const PlayerResourceArg = ({ arg, onChange, card }: Props) => {
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
									player: p,
									card
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
			<PlayerPicker
				optional={true}
				players={players}
				playerId={selectedPlayer ? selectedPlayer.id : -1}
				res={arg.resource}
				onChange={playerId => {
					setSelectedPlayer(game.players.find(p => p.id === playerId))
				}}
			/>

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
