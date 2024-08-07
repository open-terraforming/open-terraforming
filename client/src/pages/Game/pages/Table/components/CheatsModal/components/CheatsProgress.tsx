import { Button } from '@/components'
import { Flex } from '@/components/Flex/Flex'
import { useApi } from '@/context/ApiContext'
import { useAppStore } from '@/utils/hooks'
import { adminChange } from '@shared/actions'
import { GameProgress } from '@shared/cards'
import React, { useEffect, useState } from 'react'

export const CheatsProgress = () => {
	const api = useApi()
	const game = useAppStore(state => state.game.state)

	const [progress, setProgress] = useState<GameProgress>('oxygen')
	const [value, setValue] = useState(0)

	const handleSet = () => {
		api.send(
			adminChange({
				[progress]: value
			})
		)
	}

	useEffect(() => {
		setValue(game[progress])
	}, [progress])

	return (
		<Flex>
			TER:
			<select onChange={e => setProgress(e.target.value as GameProgress)}>
				<option value="oxygen">Oxygen</option>
				<option value="temperature">Temperature</option>
				<option value="oceans">Oceans</option>
				<option value="venus">Venus</option>
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
