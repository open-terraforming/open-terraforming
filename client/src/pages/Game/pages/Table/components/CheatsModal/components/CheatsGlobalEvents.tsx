import { Button } from '@/components'
import { Flex } from '@/components/Flex/Flex'
import { useApi } from '@/context/ApiContext'
import { useAppStore } from '@/utils/hooks'
import { adminChange } from '@shared/actions'
import { GlobalEventsLookupApi } from '@shared/GlobalEventsLookupApi'
import { useEffect, useState } from 'react'

type EVENT_STEP = (typeof EVENT_STEPS)[number]

const EVENT_STEPS = ['distantEvent', 'comingEvent', 'currentEvent'] as const

export const CheatsGlobalEvents = () => {
	const api = useApi()
	const game = useAppStore((state) => state.game.state)

	const [stage, setStage] = useState<EVENT_STEP>('currentEvent')

	const [value, setValue] = useState<string>()

	const handleSet = () => {
		if (!value) {
			return
		}

		if (!GlobalEventsLookupApi.getOptional(value)) {
			alert('Invalid event')

			return
		}

		api.send(
			adminChange({
				globalEvents: {
					[stage]: value,
				},
			}),
		)
	}

	useEffect(() => {
		setValue(game.globalEvents[stage] ?? undefined)
	}, [stage])

	return (
		<Flex>
			EVENT STEP:
			<select onChange={(e) => setStage(e.target.value as EVENT_STEP)}>
				{EVENT_STEPS.map((step) => (
					<option key={step} value={step}>
						{step}
					</option>
				))}
			</select>
			<input
				type="text"
				value={value ?? ''}
				onChange={(e) => setValue(e.target.value)}
			/>
			<Button onClick={handleSet}>Set</Button>
		</Flex>
	)
}
