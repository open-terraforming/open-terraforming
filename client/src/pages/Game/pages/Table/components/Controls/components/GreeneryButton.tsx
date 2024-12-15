import { useCallback } from 'react'
import { Button } from '@/components'
import { Projects } from '@shared/projects'
import { GridCellContent, StandardProjectType } from '@shared/index'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTree } from '@fortawesome/free-solid-svg-icons'
import { ResourceIcon } from '../../ResourceIcon/ResourceIcon'
import { useAppDispatch, useAppStore } from '@/utils/hooks'
import { useApi } from '@/context/ApiContext'
import { pushFrontendAction } from '@/store/modules/table'
import { pickTileFrontendAction } from '@/store/modules/table/frontendActions'

type Props = {
	className?: string
}

export const GreeneryButton = ({ className }: Props) => {
	const api = useApi()
	const dispatch = useAppDispatch()
	const playing = useAppStore((state) => state.game.playing)
	const player = useAppStore((state) => state.game.player)
	const game = useAppStore((state) => state.game.state)
	const project = Projects[StandardProjectType.GreeneryForPlants]

	const usable =
		playing &&
		project.conditions.find((c) => !c({ game, player })) === undefined

	const buyForest = useCallback(() => {
		if (player && usable) {
			dispatch(
				pushFrontendAction(
					pickTileFrontendAction(
						{ type: GridCellContent.Forest },
						StandardProjectType.GreeneryForPlants,
					),
				),
			)
		}
	}, [player, api])

	return (
		<Button
			noClip
			className={className}
			disabled={!usable}
			onClick={buyForest}
			tooltip={
				<>
					{`Build a Greenery for ${project.cost({ game, player })}`}
					<ResourceIcon margin res={project.resource} />
				</>
			}
		>
			Build <FontAwesomeIcon icon={faTree} />
		</Button>
	)
}
