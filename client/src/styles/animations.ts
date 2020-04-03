import { keyframes } from 'styled-components'

export const popOut = keyframes`
	0% {
		opacity: 0;
		transform: scale(1);
	}
	5% {
		opacity: 0.5;
	}
	100% {
		opacity: 0;
		transform: scale(2);
	}
`
