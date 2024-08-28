import styled, { css } from 'styled-components'

export const Header = styled.div`
	padding: 1rem 1.2rem;
	text-align: left;
	font-size: 125%;
	display: flex;
	align-items: center;
`

export const Body = styled.div<{ hasHeader?: boolean; hasFooter?: boolean }>`
	${(props) => css`
		padding: ${props.hasHeader ? '0' : '1rem'} 1.2rem
			${props.hasFooter ? '0' : '1rem'} 1.2rem;
	`}
	overflow: auto;
	flex: 1;
	min-height: 0;
`

export const Footer = styled.div<{ stretchFooterButtons: boolean }>`
	text-align: center;
	padding: 10px;
	display: flex;
	justify-content: flex-end;
	align-items: center;

	> button {
		display: inline-block;
		margin: 0 4px;

		${(props) =>
			props.stretchFooterButtons &&
			css`
				padding: 8px 20px;
			`}
	}
`
