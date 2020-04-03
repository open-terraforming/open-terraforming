import React, { useMemo } from 'react'
import { Modal } from '@/components/Modal/Modal'
import { StandardProjectType, buyStandardProject } from '@shared/index'
import {
	Projects,
	StandardProjectContext,
	StandardProject
} from '@shared/projects'
import styled from 'styled-components'
import { Button } from '@/components'
import { useAppStore } from '@/utils/hooks'
import { useApi } from '@/context/ApiContext'

type Props = {
	onClose: () => void
}

const projects = [
	Projects[StandardProjectType.SellPatents],
	Projects[StandardProjectType.PowerPlant],
	Projects[StandardProjectType.Asteroid],
	Projects[StandardProjectType.Aquifer],
	Projects[StandardProjectType.Greenery],
	Projects[StandardProjectType.City]
]

export const StandardProjectModal = ({ onClose }: Props) => {
	const api = useApi()
	const game = useAppStore(state => state.game.state)
	const player = useAppStore(state => state.game.player)

	const ctx = useMemo(
		() =>
			({
				game,
				player
			} as StandardProjectContext),
		[game, player]
	)

	const handleSubmit = (p: StandardProject) => {
		api.send(buyStandardProject(p.type))
		onClose()
	}

	if (!game || !player) {
		return <>No game / player</>
	}

	return (
		<Modal
			open={true}
			header={'Standard projects'}
			onClose={onClose}
			footer={<Button onClick={onClose}>Close</Button>}
		>
			{projects.map((p, i) => (
				<Project key={i}>
					<Button
						disabled={!p.conditions.every(c => c(ctx))}
						onClick={() => handleSubmit(p)}
					>
						Buy
					</Button>
					<div>{p.description}</div>
				</Project>
			))}
		</Modal>
	)
}

const Project = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 0.5rem;

	button {
		margin-right: 1rem;
	}
`
