import React, { ReactChild, ReactNode, useState, useCallback } from 'react'
import styled from 'styled-components'

export interface TabProps {
	title: string
	content: ReactChild
	icons?: ReactNode
	id?: string
}

interface Props {
	tabs: TabProps[]
	className?: string
	onChange?: (tab: TabProps) => void
	selectedTabId?: string
}

export const Tabs = ({ tabs, className, onChange, selectedTabId }: Props) => {
	const [selectedTab, setSelectedTab] = useState(0)

	const handleChange = useCallback(
		(index: number) => {
			setSelectedTab(index)

			if (onChange) {
				onChange(tabs[index])
			}
		},
		[onChange, tabs]
	)

	const isSelected = useCallback(
		(index: number, tab: TabProps) =>
			(selectedTabId && selectedTabId === tab.id) ||
			(selectedTabId === undefined && index == selectedTab),
		[selectedTabId, selectedTab]
	)

	return (
		<TabsContainer className={className}>
			<TabsBar role="tablist">
				{tabs.map((tab, i) => {
					const selected = isSelected(i, tab)

					return (
						<TabTitle
							role="tab"
							key={i}
							onClick={() => handleChange(i)}
							isSelected={selected}
							aria-selected={selected}
						>
							<span>{tab.title}</span>
							{tab.icons && <TabTitleIcon>{tab.icons}</TabTitleIcon>}
						</TabTitle>
					)
				})}
			</TabsBar>
			<TabsContent role="tabpanel">
				{tabs.map((tab, i) => isSelected(i, tab) && tab.content)}
			</TabsContent>
		</TabsContainer>
	)
}

const TabsContainer = styled.div`
	display: flex;
	flex-direction: column;
	overflow: auto;
	flex-grow: 1;
	min-height: 0;
`

const TabsContent = styled.div`
	flex-grow: 1;
	min-height: 0;
	overflow: auto;
	display: flex;
	flex-direction: column;
	align-content: flex-start;
`

const TabTitle = styled.span<{ isSelected: boolean }>`
	display: inline-block;
	text-transform: uppercase;
	user-select: none;
	background-color: ${(props) => (props.isSelected ? '#fff' : '#f0f0f0')};
	padding: 8px 16px;
	cursor: pointer;
	&:hover {
		background-color: ${(props) => (props.isSelected ? '#fff' : '#f5f5f5')};
	}
	&:not(:first-child) {
		border-left: 1px solid #eee;
	}
	&:last-child {
		border-right: 1px solid #eee;
	}
`

const TabTitleIcon = styled.span`
	margin-left: 5px;
`

const TabsBar = styled.div`
	border-bottom: 1px solid #eee;
	background-color: #fcfcfc;
`
