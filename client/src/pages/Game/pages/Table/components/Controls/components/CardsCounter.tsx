import { colors, mainColors } from '@/styles'
import React from 'react'
import styled, { css } from 'styled-components'

type Props = {
	count: React.ReactNode
	text: React.ReactNode
	disabled?: boolean
	onClick?: () => void
	children?: React.ReactNode
	onMouseOver?: (e: React.MouseEvent) => void
	onMouseLeave?: (e: React.MouseEvent) => void
}

export const CardsCounter = ({
	count,
	text,
	disabled,
	onClick,
	children,
	onMouseOver,
	onMouseLeave
}: Props) => {
	return (
		<D
			disabled={disabled}
			onClick={disabled ? undefined : onClick}
			onMouseOver={onMouseOver}
			onMouseLeave={onMouseLeave}
		>
			<Count>{count}</Count>
			<Text>{text}</Text>
			{children}
		</D>
	)
}

const D = styled.button<{ disabled?: boolean }>`
	display: flex;
	flex-direction: column;
	border-right: 0.2rem solid ${colors.border};
	min-width: 3.5rem;
	align-items: stretch;
	color: ${mainColors.text};
	flex: 1;
	position: relative;

	z-index: 2;

	&:first-child {
		border-left: 0.2rem solid ${colors.border};
	}

	${props =>
		props.disabled &&
		css`
			cursor: default;
			color: rgba(128, 128, 128, 0.7);
		`}
`

const Count = styled.div`
	flex: 1;
	text-align: center;
	font-size: 150%;
	padding: 0.2rem 0.5rem;
	display: flex;
	align-items: center;
	justify-content: space-evenly;
`

const Text = styled.div`
	background: ${colors.border};
	text-align: center;
	padding: 0.2rem 0.5rem;
	text-transform: uppercase;
`
