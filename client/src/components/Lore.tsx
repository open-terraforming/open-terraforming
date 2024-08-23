import { ReactNode } from 'react'
import styled from 'styled-components'

type Props = {
	children: ReactNode
}

export const Lore = ({ children }: Props) => {
	return <E>{children}</E>
}

const E = styled.div`
	margin: 0.5rem auto;
	padding: 1rem;
	border: 0.2rem solid ${({ theme }) => theme.colors.border};
	background-color: ${({ theme }) => theme.colors.background};
	max-width: 30rem;
	position: relative;
`
