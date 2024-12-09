import { css, styled } from 'styled-components'

export const SomethingHappenedHeader = styled.div<{ $noSpacing?: boolean }>`
	text-align: center;
	${({ $noSpacing }) =>
		!$noSpacing &&
		css`
			margin: 0.25rem 0 1rem 0;
		`}
`
