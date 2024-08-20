import { VERSION } from '@/constants'
import styled from 'styled-components'

export const Footer = () => {
	return <FooterContainer>{VERSION}</FooterContainer>
}

const FooterContainer = styled.div`
	position: fixed;
	bottom: 0.5rem;
	left: 0;
	width: 100%;
	text-align: center;
`
