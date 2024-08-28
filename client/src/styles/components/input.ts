import { css } from 'styled-components'
import { rgba, darken } from 'polished'

export default css`
	input[type='text'],
	input[type='number'],
	input[type='password'],
	textarea,
	select {
		border: 1px solid ${({ theme }) => rgba(theme.colors.application, 0.8)};
		background-color: ${({ theme }) =>
			rgba(darken(0.2, theme.colors.application), 0.5)};
		padding: 0.25rem 0.5rem;
		transition:
			border-color,
			background-color,
			box-shadow 0.2s ease;
		color: #eee;
	}

	input[type='checkbox'] {
		display: inline-block;
	}

	input:read-only {
		color: #aaa;
	}

	select option {
		color: #eee;
		background: #000;
	}
`
