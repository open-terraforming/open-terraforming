import styled from 'styled-components'
import { popOut } from '@/styles/animations'

export const DiffAnim = styled.div`
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	background: rgba(255, 255, 255, 0.5);
	border: 2px solid #fff;
	animation-name: ${popOut};
	animation-duration: 200ms;
	animation-timing-function: ease-in;
	opacity: 0;
`
