import { Button } from '@/components'
import { useApi } from '@/context/ApiContext'
import { useGameModals } from '@/context/GameModalsContext'
import { useAppStore } from '@/utils/hooks'
import { buyStandardProject, StandardProjectType } from '@shared/index'
import {
	Projects,
	StandardProject,
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
	const api = useApi()
	const game = useAppStore((state) => state.game.state)
	const player = useAppStore((state) => state.game.player)
	const playing = useAppStore((state) => state.game.playing)
	const { openSellCardsModal } = useGameModals()

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

	const handleSubmit = (p: StandardProject) => {
		if (p.type === StandardProjectType.SellPatents) {
			openSellCardsModal()
		} else {
			api.send(buyStandardProject(p.type))
			onClose?.()
		}
	}

	if (!game || !player) {
		return <>No game / player</>
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

	button {
		margin-right: 1rem;
		flex: 1;
	}

	> div {
		flex: 2;
	}
`
