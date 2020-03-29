import styled, { css } from 'styled-components'

export const Container = styled.div<{ relative?: boolean }>`
	${props =>
		props.relative &&
		css`
			position: relative;
		`}
	padding: 1rem;
	background-color: rgba(14, 129, 214, 0.8);
`
