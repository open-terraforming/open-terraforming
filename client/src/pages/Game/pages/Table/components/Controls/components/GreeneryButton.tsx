import React, { useCallback } from 'react'
import { Button } from '@/components'
import { Projects } from '@shared/projects'
import { StandardProjectType, buyStandardProject } from '@shared/index'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTree } from '@fortawesome/free-solid-svg-icons'
import { ResourceIcon } from '../../ResourceIcon/ResourceIcon'
import { useAppStore } from '@/utils/hooks'
import { useApi } from '@/context/ApiContext'

type Props = {}

export const GreeneryButton = ({}: Props) => {
	const api = useApi()
	const playing = useAppStore(state => state.game.playing)
	const player = useAppStore(state => state.game.player)
	const game = useAppStore(state => state.game.state)

	const buyForest = useCallback(() => {
		if (player && player.plants >= player.greeneryCost) {
			api.send(buyStandardProject(StandardProjectType.GreeneryForPlants))
		}
	}, [player, api])

	return (
		<Button
			disabled={
				!playing ||
				Projects[StandardProjectType.GreeneryForPlants].conditions.find(
					c => !c({ game, player })
				) !== undefined
			}
			onClick={buyForest}
		>
			Build <FontAwesomeIcon icon={faTree} /> for {player?.greeneryCost}{' '}
			<ResourceIcon res="plants" />
		</Button>
	)
}
