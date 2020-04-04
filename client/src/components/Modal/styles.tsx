import styled, { css } from 'styled-components'

export const Header = styled.div`
	padding: 15px;
	text-align: left;
	font-size: 125%;
`

export const Body = styled.div`
	padding: 15px 20px;
	overflow: auto;
	flex: 1;
	min-height: 0;
`

export const Footer = styled.div<{ stretchFooterButtons: boolean }>`
	text-align: center;
	padding: 10px;
	display: flex;
	justify-content: flex-end;

	> button {
		display: inline-block;
		margin: 0 4px;

		${props =>
			props.stretchFooterButtons &&
			css`
				padding: 8px 20px;
			`}
	}
`
