import { darken } from 'polished'
import { css } from 'styled-components'

type Params = {
	darkenRatio?: number
	darkStripeColor?: string
	lightStripeColor?: string
}

export const stripedBackground = (
	{ darkStripeColor, lightStripeColor, darkenRatio = 0.008 } = {} as Params,
) => css`
	${({
		theme: {
			colors: { background, modalBackground },
		},
	}) => css`
		background-color: ${background};
		background: linear-gradient(
			45deg,
			${darkStripeColor ?? darken(darkenRatio, modalBackground)} 25%,
			${lightStripeColor ?? modalBackground} 25%,
			${lightStripeColor ?? modalBackground} 50%,
			${darkStripeColor ?? darken(darkenRatio, modalBackground)} 50%,
			${darkStripeColor ?? darken(darkenRatio, modalBackground)} 75%,
			${lightStripeColor ?? modalBackground} 75%,
			${lightStripeColor ?? modalBackground}
		);
	`}
	background-size: 40px 40px;
`
