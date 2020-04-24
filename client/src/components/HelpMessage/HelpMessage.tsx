import React from 'react'
import styled from 'styled-components'
import { colors } from '@/styles'

type Props = {
	message: string
}

export const HelpMessage = ({ message }: Props) => {
	return <Help>{message}</Help>
}

const Help = styled.div`
	margin: 0.5rem auto;
	padding: 1rem;
	border: 0.2rem solid ${colors.border};
	background-color: ${colors.background};
	max-width: 30rem;
`
