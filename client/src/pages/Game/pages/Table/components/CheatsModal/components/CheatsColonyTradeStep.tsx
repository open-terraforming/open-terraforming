import { Button } from '@/components'
import { Flex } from '@/components/Flex/Flex'
import { useApi } from '@/context/ApiContext'
import { useAppStore } from '@/utils/hooks'
import { adminChange } from '@shared/actions'
import { useEffect, useState } from 'react'

export const CheatsColonyTradeStep = () => {
	const api = useApi()
	const game = useAppStore((state) => state.game.state)

	const [colonyIndex, setColonyIndex] = useState(0)
	const [value, setValue] = useState(0)

	const selectedColony = game.colonies[colonyIndex]

	const handleSet = () => {
		api.send(
			adminChange({
				colonies: {
					[colonyIndex]: {
						step: value,
					},
				},
			}),
		)
	}

	useEffect(() => {
		if (!selectedColony) {
			return
		}

		setValue(selectedColony.step)
	}, [selectedColony])

	return (
		<Flex>
			COLONY STEP:
			<select onChange={(e) => setColonyIndex(parseInt(e.target.value))}>
				{game.colonies.map((colony, i) => (
					<option key={i} value={i}>
						{colony.code}
					</option>
				))}
			</select>
			<input
				type="number"
				value={value}
				onChange={(e) => setValue(parseFloat(e.target.value))}
			/>
			<Button onClick={handleSet}>Set</Button>
		</Flex>
	)
}
