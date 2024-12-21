import { Button } from '@/components'
import { useApi } from '@/context/ApiContext'
import { pushFrontendAction } from '@/store/modules/table'
import {
	pickHandCardsFrontendAction,
	pickTileFrontendAction,
} from '@/store/modules/table/frontendActions'
import { useAppDispatch, useAppStore } from '@/utils/hooks'
import { buyStandardProject, StandardProjectType } from '@shared/index'
import {
	AnyStandardProject,
	Projects,
	StandardProjectArgumentType,
	StandardProjectContext,
} from '@shared/projects'
import { useMemo } from 'react'
import styled from 'styled-components'
import { ProjectDescription } from './ProjectDescription'

type Props = {
	onClose?: () => void
}

const HIDDEN_PROJECTS = [
	StandardProjectType.GreeneryForPlants,
	StandardProjectType.TemperatureForHeat,
]

export const StandardProjectsList = ({ onClose }: Props) => {
	const dispatch = useAppDispatch()
	const api = useApi()
	const game = useAppStore((state) => state.game.state)
	const player = useAppStore((state) => state.game.player)
	const playing = useAppStore((state) => state.game.playing)

	const projects = game.standardProjects
		.filter((p) => !HIDDEN_PROJECTS.includes(p.type))
		.map((p) => Projects[p.type])

	const ctx = useMemo(
		() =>
			({
				game,
				player,
			}) as StandardProjectContext,
		[game, player],
	)

	const handleSubmit = (p: AnyStandardProject) => {
		if (p.args) {
			if (p.args.length !== 1) {
				throw new Error('Only 1 argument is supported right now')
			}

			const arg = p.args[0]

			switch (arg.type) {
				case StandardProjectArgumentType.CardsInHand: {
					dispatch(pushFrontendAction(pickHandCardsFrontendAction(p.type)))
					break
				}

				case StandardProjectArgumentType.Tile: {
					if (!arg.tilePlacement) {
						throw new Error('Tile placement is required')
					}

					dispatch(
						pushFrontendAction(
							pickTileFrontendAction(arg.tilePlacement, p.type),
						),
					)

					break
				}
			}
		} else {
			api.send(buyStandardProject(p.type, []))
		}

		onClose?.()
	}

	return (
		<>
			{projects.map((p, i) => (
				<Project key={i}>
					<Button
						disabled={!playing || !p.conditions.every((c) => c(ctx))}
						onClick={() => handleSubmit(p)}
					>
						{p.type === StandardProjectType.SellPatents
							? 'Sell cards'
							: `Buy ${p.description}`}
					</Button>
					<ProjectDescription project={p} cost={p.cost(ctx)} />
				</Project>
			))}
		</>
	)
}

const Project = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 0.5rem;
	width: 22rem;

	button {
		margin-right: 1rem;
		flex: 1;
	}

	> div {
		flex: 1.5;
	}
`
