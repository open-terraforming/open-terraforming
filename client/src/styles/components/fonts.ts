import { css } from 'styled-components'

export default css`
	/* oswald-regular - latin */
	@font-face {
		font-display: swap; /* Check https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display for other options. */
		font-family: 'Oswald';
		font-style: normal;
		font-weight: 400;
		src:
			url('./fonts/oswald-v53-latin-regular.woff2') format('woff2'),
			/* Chrome 36+, Opera 23+, Firefox 39+, Safari 12+, iOS 10+ */
				url('./fonts/oswald-v53-latin-regular.ttf') format('truetype'); /* Chrome 4+, Firefox 3.5+, IE 9+, Safari 3.1+, iOS 4.2+, Android Browser 2.2+ */
	}
`