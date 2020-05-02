import React from 'react'
import { useApi } from '@/context/ApiContext'
import { useAppStore, useGameState, usePlayerState } from '@/utils/hooks'
import { Button } from '@/components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThermometerHalf } from '@fortawesome/free-solid-svg-icons'
import { ResourceIcon } from '../../ResourceIcon/ResourceIcon'
import { StandardProjectType, buyStandardProject } from '@shared/index'
import { Projects } from '@shared/projects'

type Props = {}

export const HeatButton = ({}: Props) => {
	const api = useApi()
	const playing = useAppStore(state => state.game.playing)
	const player = usePlayerState()
	const game = useGameState()

	const buyTemperature = () => {
		if (player && player.heat >= 8) {
			api.send(buyStandardProject(StandardProjectType.TemperatureForHeat))
		}
	}

	return (
		<Button
			disabled={
				!playing ||
				Projects[StandardProjectType.TemperatureForHeat].conditions.find(
					c => !c({ game, player })
				) !== undefined
			}
			onClick={buyTemperature}
		>
			+<FontAwesomeIcon icon={faThermometerHalf} /> for 8{' '}
			<ResourceIcon res="heat" />
		</Button>
	)
}
