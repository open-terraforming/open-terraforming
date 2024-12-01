import { CSSProperties, ReactNode, useState } from 'react'
import styled, { css } from 'styled-components'
import { PopoutPosition, usePopout } from '../Popout/usePopout'

interface Props {
	content?: ReactNode
	title?: ReactNode
	fullWidth?: boolean
	disableStyle?: boolean
	position?: PopoutPosition
	children?: ReactNode
	className?: string
	styleTrigger?: CSSProperties
	noSpacing?: boolean
}

export const Tooltip = ({
	position,
	disableStyle,
	content,
	title,
	fullWidth,
	children,
	className,
	styleTrigger,
	noSpacing,
}: Props) => {
	const [trigger, setTrigger] = useState<HTMLElement | null>(null)

	const popout = usePopout({
		trigger,
		position,
		className,
		disableStyle,
		disableAnimation: true,
		noSpacing: true,
		...(!fullWidth && { contentStyle: { maxWidth: '20rem' } }),
		content: (
			<>
				{title && <Title $noSpacing={noSpacing}>{title}</Title>}

				<Body $noSpacing={noSpacing}>{content}</Body>
			</>
		),
	})

	return (
		<>
			<Trigger
				ref={setTrigger}
				style={styleTrigger}
				className="tooltip-trigger"
			>
				{children}
			</Trigger>

			{popout}
		</>
	)
}

const Trigger = styled.span``

const Title = styled.div<{ $noSpacing?: boolean }>`
	background-color: ${({ theme }) => theme.colors.border};

	${({ $noSpacing }) =>
		!$noSpacing &&
		css`
			padding: 0.25rem 0.5rem;
		`}
`

const Body = styled.div<{ $noSpacing?: boolean }>`
	${({ $noSpacing }) =>
		!$noSpacing &&
		css`
			padding: 0.5rem;
		`}
`
