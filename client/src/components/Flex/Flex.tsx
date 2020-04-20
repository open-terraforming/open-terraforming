import styled, { css } from 'styled-components'

export const Flex = styled.div<{ align?: string; justify?: string }>`
	display: flex;
	min-height: 0;
	${props => css`
		align-items: ${props.align || 'center'};
		justify-content: ${props.justify || 'flex-start'};
	`}
`
