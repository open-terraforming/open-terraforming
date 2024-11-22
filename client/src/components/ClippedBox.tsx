import { stripedBackground } from '@/styles/mixins'
import { CSSProperties, ReactNode } from 'react'
import { css, styled } from 'styled-components'

type Props = {
	className?: string
	outerClassName?: string
	children?: ReactNode
	style?: CSSProperties
	clipSize?: string
}

export const ClippedBox = ({
	className,
	children,
	style,
	clipSize = '7px',
}: Props) => {
	return (
		<OuterBorder className={className} style={style} $clipSize={clipSize}>
			<Inner className="inner" $clipSize={clipSize}>
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

const Inner = styled.div<{ $clipSize: string }>`
	height: 100%;
	box-sizing: border-box;

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
