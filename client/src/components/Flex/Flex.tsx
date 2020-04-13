import styled, { css } from 'styled-components'

export const Flex = styled.div<{ align?: string; justify?: string }>`
	display: flex;
	${props => css`
		align-items: ${props.align || 'center'};
		justify-content: ${props.justify || 'flex-start'};
	`}
`
