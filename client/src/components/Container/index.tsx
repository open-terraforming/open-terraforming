import { colors } from '@/styles'
import React from 'react'
import styled from 'styled-components'

export const Container = ({
	header,
	children
}: {
	header?: React.ReactNode
	children: React.ReactNode
}) => (
	<E>
		{header && <Head>{header}</Head>}
		<Body>{children}</Body>
	</E>
)

const E = styled.div`
	border: 2px solid ${colors.border};
`

const Head = styled.div`
	background: ${colors.border};
	padding: 0.25rem 1rem;
	font-size: 150%;
`

const Body = styled.div`
	background-color: ${colors.background};
	padding: 1rem;
`
