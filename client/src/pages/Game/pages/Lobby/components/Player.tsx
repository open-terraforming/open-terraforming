import React from 'react'
import styled, { css } from 'styled-components'

type Props = {
	name: string
	ready: boolean
}

export const Player = ({ name, ready }: Props) => {
	return (
		<PlayerContainer>
			<span>{name}</span>
			<PlayerState ready={ready}>{ready ? 'Ready' : 'Waiting'}</PlayerState>
		</PlayerContainer>
	)
}

const PlayerContainer = styled.div`
	display: flex;
	align-items: center;
`

const PlayerState = styled.div<{ ready: boolean }>`
	padding: 0.25rem;
	margin-left: auto;

	${props => css`
		color: ${props.ready ? '#33ff33' : '#999'};
	`}
`
