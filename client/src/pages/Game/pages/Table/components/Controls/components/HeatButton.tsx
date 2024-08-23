import { useApi } from '@/context/ApiContext'
import { useAppStore, useGameState, usePlayerState } from '@/utils/hooks'
import { Button } from '@/components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThermometerHalf } from '@fortawesome/free-solid-svg-icons'
import { ResourceIcon } from '../../ResourceIcon/ResourceIcon'
import { StandardProjectType, buyStandardProject } from '@shared/index'
import { Projects } from '@shared/projects'

export const HeatButton = () => {
	const api = useApi()
	const playing = useAppStore((state) => state.game.playing)
	const player = usePlayerState()
	const game = useGameState()
	const project = Projects[StandardProjectType.TemperatureForHeat]

	const usable =
		playing &&
		project.conditions.find((c) => !c({ game, player })) === undefined

	const buyTemperature = () => {
		if (player && usable) {
			api.send(buyStandardProject(StandardProjectType.TemperatureForHeat))
		}
	}

	return (
		<Button
			noClip
			disabled={!usable}
			onClick={buyTemperature}
			tooltip={
				<>
					{`Increase temperature for ${project.cost({ game, player })}`}
					<ResourceIcon margin res={project.resource} />
				</>
			}
		>
			+<FontAwesomeIcon icon={faThermometerHalf} />
		</Button>
	)
}
