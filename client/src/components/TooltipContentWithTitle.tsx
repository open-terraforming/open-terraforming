import { ReactNode } from 'react'
import styled from 'styled-components'

type Props = {
	title: ReactNode
	children: ReactNode
}

export const TooltipContentWithTitle = ({ title, children }: Props) => {
	return (
		<>
			<Title>{title}</Title>
			<Content>{children}</Content>
		</>
	)
}

const Title = styled.div`
	background-color: ${({ theme }) => theme.colors.border};
	padding: 0.25rem 0.5rem;
`

const Content = styled.div`
	padding: 0.25rem 0.5rem;
`
