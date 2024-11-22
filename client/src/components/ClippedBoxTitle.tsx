import styled, { css } from 'styled-components'

export const ClippedBoxTitle = styled.div<{
	$centered?: boolean
	$spacing?: boolean
}>`
	padding: ${({ $spacing }) => ($spacing ? `0.5rem` : `0.1rem 0.5rem`)};
	background-color: ${({ theme }) => theme.colors.border};
	text-transform: uppercase;

	${({ $centered }) =>
		$centered &&
		css`
			text-align: center;
		`}
`
