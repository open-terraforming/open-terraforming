import { stripedBackground } from '@/styles/mixins'
import { CSSProperties, ReactNode } from 'react'
import { css, styled } from 'styled-components'

type Props = {
	className?: string
	outerClassName?: string
	children?: ReactNode
	style?: CSSProperties
	clipSize?: string
	onClick?: () => void
	innerSpacing?: boolean
}

export const ClippedBox = ({
	className,
	children,
	style,
	onClick,
	clipSize = '7px',
	innerSpacing,
}: Props) => {
	return (
		<OuterBorder
			className={className}
			style={style}
			$clipSize={clipSize}
			onClick={onClick}
		>
			<Inner className="inner" $clipSize={clipSize} $spacing={innerSpacing}>
				{children}
			</Inner>
		</OuterBorder>
	)
}

const OuterBorder = styled.div<{ $clipSize: string }>`
	padding: 2px;
	box-sizing: border-box;
	background-color: ${({ theme }) => theme.colors.border};
	${({ $clipSize }) => css`
		clip-path: polygon(
			0 0,
			calc(100% - ${$clipSize}) 0,
			100% ${$clipSize},
			100% 100%,
			${$clipSize} 100%,
			0 calc(100% - ${$clipSize})
		);
	`}
`

const Inner = styled.div<{ $clipSize: string; $spacing?: boolean }>`
	height: 100%;
	box-sizing: border-box;

	${({ $spacing }) =>
		$spacing &&
		css`
			padding: 0.5rem;
		`}

	${stripedBackground()}

	${({ $clipSize }) => css`
		clip-path: polygon(
			0 0,
			calc(100% - ${$clipSize}) 0,
			100% ${$clipSize},
			100% 100%,
			${$clipSize} 100%,
			0 calc(100% - ${$clipSize})
		);
	`}
`
