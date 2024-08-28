import styled, { css } from 'styled-components'

export const Flex = styled.div<{
	align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
	justify?:
		| 'flex-start'
		| 'flex-end'
		| 'center'
		| 'space-between'
		| 'space-around'
	direction?: 'row' | 'column'
}>`
	display: flex;
	min-height: 0;
	${(props) => css`
		align-items: ${props.align || 'center'};
		justify-content: ${props.justify || 'flex-start'};
		flex-direction: ${props.direction || 'row'};
	`}
`
