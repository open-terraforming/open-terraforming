import { stripedBackground } from '@/styles/mixins'
import { ReactNode } from 'react'
import { styled } from 'styled-components'

type Props = {
	className?: string
	outerClassName?: string
	children: ReactNode
}

export const ClippedBox = ({ className, children }: Props) => {
	return (
		<OuterBorder className={className}>
			<Inner className="inner">{children}</Inner>
		</OuterBorder>
	)
}

const OuterBorder = styled.div`
	padding: 2px;
	background-color: ${({ theme }) => theme.colors.border};
	clip-path: polygon(
		0 0,
		calc(100% - 7px) 0,
		100% 7px,
		100% 100%,
		7px 100%,
		0 calc(100% - 7px)
	);
`

const Inner = styled.div`
	${stripedBackground()}

	clip-path: polygon(
		0 0,
		calc(100% - 7px) 0,
		100% 7px,
		100% 100%,
		7px 100%,
		0 calc(100% - 7px)
	);
`
