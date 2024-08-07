import { Button } from '@/components'
import { Flex } from '@/components/Flex/Flex'
import { useApi } from '@/context/ApiContext'
import { useAppStore } from '@/utils/hooks'
import { adminChange } from '@shared/actions'
import { Resource } from '@shared/cards'
import React, { useEffect, useState } from 'react'

export const CheatsResources = () => {
	const api = useApi()
	const game = useAppStore(state => state.game.state)

	const [playerIndex, setPlayerIndex] = useState(0)
	const [resource, setResource] = useState<Resource>('money')
	const [value, setValue] = useState(0)

	const handleSet = () => {
		api.send(
			adminChange({
				players: {
					[playerIndex]: {
						[resource]: value
					}
				}
			})
		)
	}

	useEffect(() => {
		setValue(game.players[playerIndex][resource])
	}, [playerIndex, resource])

	return (
		<Flex>
			RES:
			<select onChange={e => setPlayerIndex(parseInt(e.target.value))}>
				{game.players.map((player, i) => (
					<option key={i} value={i}>
						{player.name}
					</option>
				))}
			</select>
			<select onChange={e => setResource(e.target.value as Resource)}>
				<option value="money">Money</option>
				<option value="ore">Ore</option>
				<option value="titan">Titan</option>
				<option value="plants">Plants</option>
				<option value="energy">Energy</option>
				<option value="heat">Heat</option>
			</select>
			<input
				type="number"
				value={value}
				onChange={e => setValue(parseFloat(e.target.value))}
			/>
			<Button onClick={handleSet}>Set</Button>
		</Flex>
	)
}
