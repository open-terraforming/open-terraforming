import { ReactNode } from 'react'
import styled from 'styled-components'

type Props = {
	title: ReactNode
	children: ReactNode
}

export const BoxWithTitle = ({ title, children }: Props) => {
	return (
		<Box className="box">
			<Title>{title}</Title>
			<Content>{children}</Content>
		</Box>
	)
}

const Box = styled.div`
	margin: 0.5rem auto;
	padding: 1rem;
	border: 0.2rem solid ${({ theme }) => theme.colors.border};
	background-color: ${({ theme }) => theme.colors.background};
	margin-top: 2rem;
`

const Title = styled.div`
	margin-top: -2rem;
	margin-left: auto;
	margin-right: auto;
	width: fit-content;
	background-color: ${({ theme }) => theme.colors.background};
	border: 0.2rem solid ${({ theme }) => theme.colors.border};
	padding: 0.2rem 0.6rem;
	margin-bottom: 1rem;
`

const Content = styled.div``
