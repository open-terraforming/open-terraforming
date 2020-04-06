import { keyframes } from 'styled-components'

export const popOut = keyframes`
	0% {
		opacity: 0;
		transform: translate(0, 0) scaleY(1);
	}
	5% {
		opacity: 0.5;
	}
	100% {
		opacity: 0;
		transform: translate(0, -20rem) scaleY(5);
	}
`
