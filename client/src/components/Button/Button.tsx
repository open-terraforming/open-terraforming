import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import React, { memo, useMemo } from 'react'
import Tooltip from '@/components/Tooltip/Tooltip'
import styled, { css } from 'styled-components'

export type Schema = 'primary' | 'transparent'

export type Size = 'xs' | 'sm' | 'md' | 'lg'

interface Props {
	disabled?: boolean
	isLoading?: boolean
	icon?: IconProp
	schema?: Schema
	size?: Size
	type?: 'button' | 'submit' | 'reset'
	name?: string
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
	onMouseOver?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
	onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
	tooltip?: string
	ariaLabel?: string
	className?: string
	coloredIcon?: boolean
	children?: React.ReactNode
}

const Button = ({
	disabled = false,
	name,
	schema,
	type = 'button',
	size = 'md',
	children,
	icon,
	onClick,
	isLoading = false,
	onMouseOver,
	onMouseLeave,
	tooltip,
	ariaLabel,
	className,
	coloredIcon
}: Props) => {
	const hasContent = !!children

	let iconToShow = icon

	if (isLoading) {
		iconToShow = faSpinner
	}

	let contents = useMemo(
		() => (
			<>
				{iconToShow && (
					<Icon
						disabled={disabled || false}
						hasContent={hasContent}
						coloredIcon={coloredIcon}
						schema={schema || 'primary'}
					>
						<FontAwesomeIcon icon={iconToShow} spin={isLoading} />
					</Icon>
				)}
				{children}
			</>
		),
		[children, iconToShow, disabled, hasContent, coloredIcon, schema, isLoading]
	)

	if (tooltip) {
		contents = <Tooltip content={tooltip}>{contents}</Tooltip>
	}

	return (
		<Container
			className={className}
			disabled={disabled || false}
			name={name}
			onClick={!disabled ? onClick : undefined}
			onMouseOver={onMouseOver}
			onMouseLeave={onMouseLeave}
			type={type}
			hasContent={hasContent}
			schema={schema || 'primary'}
			size={size || 'md'}
			aria-label={ariaLabel}
		>
			{contents}
		</Container>
	)
}

const Container = styled.button<{
	disabled: boolean
	hasContent: boolean
	schema: Schema
	size: Size
}>`
	transition: 0.2s;
	border-radius: 0;
	text-transform: uppercase;
	border: 0;
	user-select: none;
	display: flex;
	justify-content: center;
	font-size: 100%;

	${props => css`
		padding: ${props.size === 'sm' ? '0.1rem 0.2rem' : '0.4rem 0.8rem'};
		border-width: 1px;
		border-style: solid;
	`}

	${props =>
		!props.disabled &&
		css`
			background: ${props.theme.colors.button[props.schema].background};
			border-color: ${props.theme.colors.button[props.schema].borderColor};
			color: ${props.theme.colors.button[props.schema].color};

			&:hover {
				background: ${props.theme.colors.button[props.schema].hover.background};
				border-color: ${props.theme.colors.button[props.schema].hover
					.borderColor};
				color: ${props.theme.colors.button[props.schema].hover.color};
				& svg {
					color: ${props.theme.colors.button[props.schema].hover.color};
				}
			}
		`}

	${props =>
		props.disabled &&
		css`
			cursor: not-allowed;
			opacity: 0.5;
			background: ${props.theme.colors.button.disabledBackground} !important;
			border-color: ${props.theme.colors.button.disabledBorder} !important;
		`}

	> * {
		margin: 0 0.25rem;
	}
`

const Icon = styled.span<{
	disabled: boolean
	hasContent: boolean
	coloredIcon?: boolean
	schema: Schema
}>`
	margin-right: 0.5rem;

	${props =>
		props.coloredIcon &&
		!props.disabled &&
		css`
			color: ${props.theme.colors.button[props.schema].background};
		`}

	${props =>
		!props.hasContent &&
		css`
			margin-right: 0;
		`}
`

export default memo(Button)
