import { ReactNode } from 'react'
import styled from 'styled-components'

type Props = {
	title?: ReactNode
	children: ReactNode
}

export const TooltipContent = ({ title, children }: Props) => {
	return (
		<>
			{title && <Title>{title}</Title>}
			<Content>{children}</Content>
		</>
	)
}

const Title = styled.div`
	background-color: ${({ theme }) => theme.colors.border};
	padding: 0.25rem 0.5rem;
`

const Content = styled.div`
	padding: 0.5rem;
	max-width: 20rem;
`
