import { css } from 'styled-components'

export default css`
	.fade-enter {
		opacity: 0;
		transition: opacity 100ms;
	}
	.fade-enter-active {
		opacity: 1;
		transition: opacity 100ms;
	}
	.fade-exit {
		transition: opacity 100ms;
		opacity: 1;
	}
	.fade-exit-active {
		opacity: 0;
		transition: opacity 100ms;
	}
`
