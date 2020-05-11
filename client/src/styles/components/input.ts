import { css } from 'styled-components'
import { rgba, darken } from 'polished'
import { colors } from '..'

export default css`
	input[type='text'],
	input[type='number'],
	input[type='password'],
	textarea,
	select {
		border: 1px solid ${rgba(colors.application, 0.8)};
		background-color: ${rgba(darken(0.2, colors.application), 0.5)};
		padding: 0.25rem 0.5rem;
		transition: border-color, background-color, box-shadow 0.2s ease;
		color: #eee;
	}

	input[type='checkbox'] {
		display: inline-block;
	}

	select option {
		color: #eee;
		background: #000;
	}
`
