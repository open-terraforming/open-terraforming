import { Button, DialogWrapper } from '@/components'
import { colors } from '@/styles'
import { useAppStore } from '@/utils/hooks'
import React from 'react'
import styled from 'styled-components'
import { CompetitionsModal } from '../CompetitionsModal/CompetitionsModal'
import { MilestonesModal } from '../MilestonesModal/MilestonesModal'
import { StandardProjectModal } from '../StandardProjectModal/StandardProjectModal'

type Props = {}

export const Header = ({}: Props) => {
	const interrupted = useAppStore(state => state.game.interrupted)

	return (
		<E
			style={{
				transform: interrupted ? 'translate(0, -100%)' : 'translate(-50%, 0)'
			}}
		>
			<DialogWrapper dialog={close => <MilestonesModal onClose={close} />}>
				{open => <StyledButton onClick={open}>Milestones</StyledButton>}
			</DialogWrapper>
			<DialogWrapper dialog={close => <StandardProjectModal onClose={close} />}>
				{open => (
					<StandardButton onClick={open}>Standard projects</StandardButton>
				)}
			</DialogWrapper>
			<DialogWrapper dialog={close => <CompetitionsModal onClose={close} />}>
				{open => <StyledButton onClick={open}>Competitions</StyledButton>}
			</DialogWrapper>
		</E>
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
	transition: transform 0.2s;
`

const StyledButton = styled(Button)`
	background-color: ${colors.background};
	border: 2px solid ${colors.border};
	padding: 0.5rem 1rem;
`

const StandardButton = styled(StyledButton)`
	margin: 0 0.5rem;
	padding: 1rem;
`
