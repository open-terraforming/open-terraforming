import { css } from 'styled-components'
import colors from '../colors'
import { media } from '../media'

export default css`
	div::-webkit-scrollbar {
		width: 1rem;
		height: 1rem;
	}

	div::-webkit-scrollbar-track {
		background-color: ${colors.background};
	}

	div::-webkit-scrollbar-thumb {
		background-color: ${colors.border};
	}

	${media.medium} {
		div::-webkit-scrollbar {
			width: 0.2rem;
			height: 0.2rem;
		}
	}
`
