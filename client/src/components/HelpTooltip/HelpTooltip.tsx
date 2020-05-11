import React from 'react'
import styled from 'styled-components'
import { Tooltip } from '../Tooltip/Tooltip'

type Props = {
	title?: React.ReactNode
	content: React.ReactNode
	children: React.ReactNode
}

export const HelpTooltip = ({ title, content, children }: Props) => {
	return (
		<HelpContainer
			content={
				<>
					{title && <HelpTitle>{title}</HelpTitle>}
					{content}
				</>
			}
		>
			{children}
		</HelpContainer>
	)
}

const HelpTitle = styled.div`
	margin-bottom: 0.5rem;
`

const HelpContainer = styled(Tooltip)`
	max-width: 20rem;
`
