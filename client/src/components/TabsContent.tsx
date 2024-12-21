import { ReactNode } from 'react'
import styled from 'styled-components'

type Props = {
	tab: string
	tabs: { content: ReactNode; key: string }[]
}

export const TabsContent = ({ tab, tabs }: Props) => {
	return <Content>{tabs.find(({ key }) => key === tab)?.content}</Content>
}

const Content = styled.div`
	flex: 1;
	overflow: auto;
`
