import { darkStripedBackground } from '@/styles/mixins'
import { darken } from 'polished'
import styled, { css } from 'styled-components'

export const Header = styled.div`
	padding: 0.8rem 1rem;
	text-align: left;
	font-size: 125%;
	display: flex;
	align-items: center;
	background-color: ${({ theme }) => darken(0.05, theme.colors.background)};
	${darkStripedBackground}

	border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`

export const Body = styled.div<{ hasHeader?: boolean; hasFooter?: boolean }>`
	padding: 0.8rem 1rem 0.8rem 1rem;
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

	background-color: ${({ theme }) => darken(0.05, theme.colors.background)};
	${darkStripedBackground}

	border-top: 2px solid ${({ theme }) => theme.colors.border};

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
