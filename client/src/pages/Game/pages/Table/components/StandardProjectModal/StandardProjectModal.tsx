import React, { useMemo, useState } from 'react'
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
import { ProjectDescription } from './components/ProjectDescription'
import { SellCardsModal } from './components/SellCardsModal'

type Props = {
	playing: boolean
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

export const StandardProjectModal = ({ onClose, playing }: Props) => {
	const api = useApi()
	const game = useAppStore(state => state.game.state)
	const player = useAppStore(state => state.game.player)
	const [selling, setSelling] = useState(false)

	const ctx = useMemo(
		() =>
			({
				game,
				player
			} as StandardProjectContext),
		[game, player]
	)

	const handleSubmit = (p: StandardProject) => {
		if (p.type === StandardProjectType.SellPatents) {
			setSelling(true)
		} else {
			api.send(buyStandardProject(p.type))
			onClose()
		}
	}

	if (!game || !player) {
		return <>No game / player</>
	}

	return (
		<>
			<Modal
				contentStyle={{ width: '600px' }}
				open={true}
				header={'Standard projects'}
				onClose={onClose}
			>
				{projects.map((p, i) => (
					<Project key={i}>
						<Button
							disabled={!playing || !p.conditions.every(c => c(ctx))}
							onClick={() => handleSubmit(p)}
						>
							{p.type === StandardProjectType.SellPatents
								? 'Sell cards'
								: `Buy ${p.description}`}
						</Button>
						<ProjectDescription project={p} cost={p.cost(ctx)} />
					</Project>
				))}
			</Modal>
			{selling && <SellCardsModal onClose={onClose} />}
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
