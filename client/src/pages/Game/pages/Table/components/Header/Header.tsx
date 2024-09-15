import { Button, DialogWrapper } from '@/components'
import { Flex } from '@/components/Flex/Flex'
import { usePopout } from '@/components/Popout/Popout'
import { useGameState } from '@/utils/hooks'
import { ExpansionType } from '@shared/expansions/types'
import { useState } from 'react'
import styled from 'styled-components'
import { CompetitionsModal } from '../CompetitionsModal/CompetitionsModal'
import { CompetitionsList } from '../CompetitionsModal/components/CompetitionsList'
import { MilestonesDisplay } from '../MilestonesModal/components/MilestonesDisplay'
import { MilestonesModal } from '../MilestonesModal/MilestonesModal'
import { StandardProjectModal } from '../StandardProjectModal/StandardProjectModal'
import { ColoniesButton } from './components/ColoniesButton'
import { HeaderEventDisplay } from './components/HeaderEventDisplay'
import { StandardProjectsList } from '../StandardProjectModal/components/StandardProjectsList'

export const Header = () => {
	const game = useGameState()
	const milestones = game.milestones
	const competitions = game.competitions

	const [milestonesButton, setMilestonesButton] = useState<HTMLElement | null>(
		null,
	)

	const [competitionsButton, setCompetitionsButton] =
		useState<HTMLElement | null>(null)

	const [standardProjectsButton, setStandardProjectsButton] =
		useState<HTMLElement | null>(null)

	const milestonesPopout = usePopout({
		trigger: milestonesButton,
		position: 'bottom-right',
		content: <MilestonesDisplay />,
		sticky: true,
	})

	const competitionsPopout = usePopout({
		trigger: competitionsButton,
		position: 'bottom-left',
		content: <CompetitionsList />,
		sticky: true,
	})

	const standardProjectsPopout = usePopout({
		trigger: standardProjectsButton,
		position: 'bottom-center',
		content: <StandardProjectsList />,
		sticky: true,
	})

	return (
		<>
			<E>
				{milestonesPopout}
				{competitionsPopout}
				{standardProjectsPopout}

				<Flex align="flex-start">
					<DialogWrapper
						dialog={(close) => <MilestonesModal onClose={close} />}
					>
						{(open) => (
							<StyledButton noClip onClick={open} ref={setMilestonesButton}>
								<Counter>
									{milestones.length}/{game.milestonesLimit}
								</Counter>
								<span>Milestones</span>
							</StyledButton>
						)}
					</DialogWrapper>
					<DialogWrapper
						dialog={(close) => <StandardProjectModal onClose={close} />}
					>
						{(open) => (
							<StandardButton
								noClip
								onClick={open}
								ref={setStandardProjectsButton}
							>
								Standard projects
							</StandardButton>
						)}
					</DialogWrapper>
					<DialogWrapper
						dialog={(close) => <CompetitionsModal onClose={close} />}
					>
						{(open) => (
							<StyledButton noClip onClick={open} ref={setCompetitionsButton}>
								<span>Competitions</span>
								<Counter>
									{competitions.length}/{game.competitionsLimit}
								</Counter>
							</StyledButton>
						)}
					</DialogWrapper>
				</Flex>
				{game.expansions.includes(ExpansionType.Colonies) && (
					<Flex justify="center">
						<ColoniesButton />
					</Flex>
				)}
			</E>
			<HeaderEventDisplay />
		</>
	)
}

const E = styled.div`
	position: absolute;
	left: 50%;
	top: 0;
	z-index: 2;
	transform: translate(-50%, 0);
	transition: transform 0.5s;
`

const StyledButton = styled(Button)`
	background-color: ${({ theme }) => theme.colors.background};
	border: 2px solid ${({ theme }) => theme.colors.border};
	padding: 0 0.8rem;
	width: 10rem;

	> span {
		padding: 0.5rem 0.2rem;
	}
`

const StandardButton = styled(StyledButton)`
	margin: 0 0.5rem;
	padding: 1rem;
	width: 12rem;
`

const Counter = styled.div`
	padding: 0.5rem 0.2rem;
`
