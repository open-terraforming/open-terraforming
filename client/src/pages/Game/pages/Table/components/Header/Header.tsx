import { Button, DialogWrapper } from '@/components'
import { Flex } from '@/components/Flex/Flex'
import { useGameState } from '@/utils/hooks'
import styled from 'styled-components'
import { CompetitionsModal } from '../CompetitionsModal/CompetitionsModal'
import { MilestonesModal } from '../MilestonesModal/MilestonesModal'
import { StandardProjectModal } from '../StandardProjectModal/StandardProjectModal'
import { ColoniesButton } from './components/ColoniesButton'
import { HeaderEventDisplay } from './components/HeaderEventDisplay'
import { ExpansionType } from '@shared/expansions/types'

export const Header = () => {
	const game = useGameState()
	const milestones = game.milestones
	const competitions = game.competitions

	return (
		<>
			<E>
				<Flex align="flex-start">
					<DialogWrapper
						dialog={(close) => <MilestonesModal onClose={close} />}
					>
						{(open) => (
							<StyledButton noClip onClick={open}>
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
							<StandardButton noClip onClick={open}>
								Standard projects
							</StandardButton>
						)}
					</DialogWrapper>
					<DialogWrapper
						dialog={(close) => <CompetitionsModal onClose={close} />}
					>
						{(open) => (
							<StyledButton noClip onClick={open}>
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
