import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { memo, MouseEvent, ReactChild, ReactNode, useMemo } from 'react'
import { Tooltip } from '@/components/Tooltip/Tooltip'
import styled, { css } from 'styled-components'

export type Schema = 'primary' | 'transparent'

export type Size = 'xs' | 'sm' | 'md' | 'lg'

export interface ButtonProps {
	disabled?: boolean
	isLoading?: boolean
	icon?: IconProp
	schema?: Schema
	type?: 'button' | 'submit' | 'reset'
	name?: string
	onClick?: (e: MouseEvent<HTMLButtonElement>) => void
	onMouseOver?: (e: MouseEvent<HTMLButtonElement>) => void
	onMouseLeave?: (e: MouseEvent<HTMLButtonElement>) => void
	tooltip?: ReactChild
	className?: string
	children?: ReactNode
	noClip?: boolean
}

const ButtonComponent = ({
	disabled = false,
	name,
	schema,
	type = 'button',
	children,
	icon,
	onClick,
	isLoading = false,
	onMouseOver,
	onMouseLeave,
	tooltip,
	className,
	noClip = false,
}: ButtonProps) => {
	const hasContent = children !== null && children !== undefined

	let iconToShow = icon

	if (isLoading) {
		iconToShow = faSpinner
	}

	let contents = useMemo(
		() => (
			<>
				{iconToShow && (
					<Icon
						isDisabled={disabled || false}
						hasContent={hasContent}
						schema={schema || 'primary'}
					>
						<FontAwesomeIcon icon={iconToShow} spin={isLoading} />
					</Icon>
				)}
				{children}
			</>
		),
		[children, iconToShow, disabled, hasContent, schema, isLoading],
	)

	if (tooltip) {
		contents = <Tooltip content={tooltip}>{contents}</Tooltip>
	}

	return (
		<Container
			noClip={noClip}
			className={className}
			isDisabled={disabled || false}
			name={name}
			onClick={!disabled ? onClick : undefined}
			onMouseOver={onMouseOver}
			onMouseLeave={onMouseLeave}
			type={type}
			hasContent={hasContent}
			schema={schema || 'primary'}
		>
			{contents}
		</Container>
	)
}

const Container = styled.button<{
	isDisabled: boolean
	hasContent: boolean
	schema: Schema
	noClip: boolean
}>`
	transition: 0.2s;
	border-radius: 0;
	text-transform: uppercase;
	border: 0;
	user-select: none;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 100%;

	padding: 0.4rem 0.8rem;
	border-width: 1px;
	border-style: solid;

	> span.tooltip-trigger {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	${(props) =>
		!props.noClip &&
		css`
			clip-path: polygon(
				0 0,
				calc(100% - 7px) 0,
				100% 7px,
				100% 100%,
				7px 100%,
				0 calc(100% - 7px)
			);
		`}

	${(props) =>
		!props.isDisabled &&
		css`
			background: ${props.theme.colors.button[props.schema].background};
			border-color: ${props.theme.colors.button[props.schema].borderColor};
			color: ${props.theme.colors.button[props.schema].color};

			&:hover {
				background: ${props.theme.colors.button[props.schema].hover.background};
				border-color: ${props.theme.colors.button[props.schema].hover
					.borderColor};
				color: ${props.theme.colors.button[props.schema].hover.color};

				/*
				& svg {
					color: ${props.theme.colors.button[props.schema].hover.color};
				}
				*/
			}
		`}

	${(props) =>
		props.isDisabled &&
		css`
			cursor: not-allowed;
			opacity: 0.5;
			background: ${props.theme.colors.button.disabledBackground} !important;
			border-color: ${props.theme.colors.button.disabledBorder} !important;
			color: ${props.theme.colors.button.disabledColor} !important;
		`}

	> * {
		margin: 0 0.25rem;
	}
`

const Icon = styled.span<{
	isDisabled: boolean
	hasContent: boolean
	schema: Schema
}>`
	margin-right: 0.5rem;

	${(props) =>
		!props.isDisabled &&
		css`
			color: ${props.theme.colors.button[props.schema].color};
		`}

	${(props) =>
		!props.hasContent &&
		css`
			margin: 0;
		`}
`

export const Button = memo(ButtonComponent)
