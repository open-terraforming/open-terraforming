import { ReactNode } from 'react'
import styled from 'styled-components'

type Props<TTab> = {
	tab: TTab
	tabs: { content: ReactNode; key: TTab }[]
}

export const TabsContent = <TTab extends string | number>({
	tab,
	tabs,
}: Props<TTab>) => {
	return <Content>{tabs.find(({ key }) => key === tab)?.content}</Content>
}

const Content = styled.div`
	flex: 1;
	overflow: auto;
`
