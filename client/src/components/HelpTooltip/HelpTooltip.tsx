import styled from 'styled-components'
import { Tooltip } from '../Tooltip/Tooltip'
import { ReactNode } from 'react'

type Props = {
	title?: ReactNode
	content: ReactNode
	children: ReactNode
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
