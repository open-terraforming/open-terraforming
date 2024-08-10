import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTint } from '@fortawesome/free-solid-svg-icons'

type Props = {
	current: number
	target: number
}

export const Oceans = ({ current, target }: Props) => {
	return (
		<E>
			<Icon>
				<FontAwesomeIcon icon={faTint} size="lg" color="#46a3ff" />
			</Icon>
			<Value>
				{current} <Target>/ {target}</Target>
			</Value>
		</E>
	)
}

const E = styled.div`
	margin-top: 1rem;
	margin-right: 2rem;
	display: flex;
	margin-left: auto;
`

const Icon = styled.div`
	padding: 0 1rem;
	display: flex;
	align-items: center;
	border: 2px solid ${({ theme }) => theme.colors.border};
	border-right: 0;
	background-color: ${({ theme }) => theme.colors.background};
`

const Value = styled.div`
	background-color: ${({ theme }) => theme.colors.border};
	border-left: 0;

	padding: 0.5rem;
	font-size: 150%;

	flex: 1;

	text-align: center;
`

const Target = styled.span`
	color: #aaa;
`
