import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ReactNode } from 'react'
import styled from 'styled-components'

type Props = {
	href: string
	children: ReactNode
	className?: string
}

export const ExternalLink = ({ href, children, className }: Props) => {
	return (
		<Container
			className={className}
			href={href}
			target="_blank"
			rel="noreferrer"
		>
			<FontAwesomeIcon icon={faExternalLinkAlt} />
			{children}
		</Container>
	)
}

const Container = styled.a`
	display: inline-flex;
	gap: 0.5rem;
	align-items: center;
`
