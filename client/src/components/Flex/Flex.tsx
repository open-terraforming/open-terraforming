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
	wrap?: 'wrap' | 'nowrap' | 'wrap-reverse'
	gap?: string | number
}>`
	display: flex;
	min-height: 0;
	${(props) => css`
		align-items: ${props.align || 'center'};
		justify-content: ${props.justify || 'flex-start'};
		flex-direction: ${props.direction || 'row'};
		gap: ${props.gap || '0'};
		flex-wrap: ${props.wrap || 'nowrap'};
	`}
`
