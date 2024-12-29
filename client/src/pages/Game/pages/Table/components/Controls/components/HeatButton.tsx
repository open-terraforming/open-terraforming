import { Button } from '@/components'
import { useApi } from '@/context/ApiContext'
import { useAppStore, useGameState, usePlayerState } from '@/utils/hooks'
import {
	faArrowRight,
	faThermometerHalf,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { StandardProjectType, buyStandardProject } from '@shared/index'
import { Projects } from '@shared/projects'
import { ResourceIcon } from '../../ResourceIcon/ResourceIcon'
import { Flex } from '@/components/Flex/Flex'
import styled from 'styled-components'

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
			api.send(buyStandardProject(StandardProjectType.TemperatureForHeat, []))
		}
	}

	const cost = project.cost({ game, player })

	return (
		<IncreaseButton
			noClip
			disabled={!usable}
			onClick={buyTemperature}
			tooltip={
				<>
					{`Increase temperature for ${cost}`}
					<ResourceIcon margin res={project.resource} />
				</>
			}
		>
			<Flex gap="0.25rem">
				<div>
					{cost} <ResourceIcon res={project.resource} />
				</div>
				<FontAwesomeIcon icon={faArrowRight} />{' '}
				<FontAwesomeIcon icon={faThermometerHalf} />
			</Flex>
		</IncreaseButton>
	)
}

const IncreaseButton = styled(Button)`
	padding: 0.25rem 0.25rem;
`
