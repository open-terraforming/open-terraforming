import { darken } from 'polished'
import { ReactNode } from 'react'
import { css, styled } from 'styled-components'
import { Box } from './Box'

type Props = {
	tab: string
	setTab: (tab: string) => void
	tabs: { title: ReactNode; key: string }[]
	suffix?: ReactNode
}

export const TabsHead = ({ tab, tabs, setTab, suffix }: Props) => {
	return (
		<Head gap="0.25rem" align="flex-end">
			{tabs.map(({ title, key }) => (
				<Tab $active={key === tab} key={key} onClick={() => setTab(key)}>
					{title}
				</Tab>
			))}
			{suffix}
		</Head>
	)
}

const Head = styled(Box)`
	background-color: ${({ theme }) => darken(0.05, theme.colors.background)};
	padding: 0.25rem 0.5rem 0 0.5rem;
	border-bottom: 2px solid ${({ theme }) => theme.colors.border};
	flex-grow: 0;
	flex-shrink: 0;
`

const Tab = styled.div<{ $active: boolean }>`
	cursor: pointer;
	padding: 0.5rem 1rem;
	text-transform: uppercase;

	${({ $active, theme }) => css`
		background-color: ${$active
			? theme.colors.border
			: theme.colors.background};
	`}

	clip-path: polygon(
				0 0,
				calc(100% - 7px) 0,
				100% 7px,
				100% 100%,
				0 100%
			);
`
