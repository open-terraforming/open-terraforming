import { Button } from '@/components'
import { Flex } from '@/components/Flex/Flex'
import { useApi } from '@/context/ApiContext'
import { pushFrontendAction } from '@/store/modules/table'
import { pickTileFrontendAction } from '@/store/modules/table/frontendActions'
import { useAppDispatch, useAppStore } from '@/utils/hooks'
import { faArrowRight, faTree } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GridCellContent, StandardProjectType } from '@shared/index'
import { Projects } from '@shared/projects'
import { useCallback } from 'react'
import { ResourceIcon } from '../../ResourceIcon/ResourceIcon'
import { styled } from 'styled-components'

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

	const cost = project.cost({ game, player })

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
		<IncreaseButton
			noClip
			className={className}
			disabled={!usable}
			onClick={buyForest}
			tooltip={
				<>
					{`Build a Greenery for ${cost}`}
					<ResourceIcon margin res={project.resource} />
				</>
			}
		>
			<Flex gap="0.25rem">
				<div>
					{cost} <ResourceIcon res={project.resource} />
				</div>
				<FontAwesomeIcon icon={faArrowRight} />{' '}
				<FontAwesomeIcon icon={faTree} />
			</Flex>
		</IncreaseButton>
	)
}

const IncreaseButton = styled(Button)`
	padding: 0.25rem 0.25rem;
`
