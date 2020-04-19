import { Button, DialogWrapper } from '@/components'
import { colors } from '@/styles'
import { useAppStore } from '@/utils/hooks'
import { COMPETITIONS_LIMIT, MILESTONES_LIMIT } from '@shared/constants'
import React from 'react'
import styled from 'styled-components'
import { CompetitionsModal } from '../CompetitionsModal/CompetitionsModal'
import { MilestonesModal } from '../MilestonesModal/MilestonesModal'
import { StandardProjectModal } from '../StandardProjectModal/StandardProjectModal'
import { HeaderEventDisplay } from './components/HeaderEventDisplay'

type Props = {}

export const Header = ({}: Props) => {
	const interrupted = useAppStore(state => state.game.interrupted)
	const milestones = useAppStore(state => state.game.state.milestones)
	const competitions = useAppStore(state => state.game.state.competitions)

	return (
		<>
			<E
				style={{
					transform: interrupted
						? 'translate(-50%, -100%)'
						: 'translate(-50%, 0)'
				}}
			>
				<DialogWrapper dialog={close => <MilestonesModal onClose={close} />}>
					{open => (
						<StyledButton onClick={open}>
							<Counter>
								{milestones.length}/{MILESTONES_LIMIT}
							</Counter>
							<span>Milestones</span>
						</StyledButton>
					)}
				</DialogWrapper>
				<DialogWrapper
					dialog={close => <StandardProjectModal onClose={close} />}
				>
					{open => (
						<StandardButton onClick={open}>Standard projects</StandardButton>
					)}
				</DialogWrapper>
				<DialogWrapper dialog={close => <CompetitionsModal onClose={close} />}>
					{open => (
						<StyledButton onClick={open}>
							<span>Competitions</span>
							<Counter>
								{competitions.length}/{COMPETITIONS_LIMIT}
							</Counter>
						</StyledButton>
					)}
				</DialogWrapper>
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
	display: flex;
	transform: translate(-50%, 0);
	align-items: flex-start;
	transition: transform 0.5s;
`

const StyledButton = styled(Button)`
	background-color: ${colors.background};
	border: 2px solid ${colors.border};
	padding: 0 0.8rem;
	> span {
		padding: 0.5rem 0.2rem;
	}
`

const StandardButton = styled(StyledButton)`
	margin: 0 0.5rem;
	padding: 1rem;
`

const Counter = styled.div`
	padding: 0.5rem 0.2rem;
`
