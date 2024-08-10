import { CardCategory } from '@shared/cards'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Tag } from '../../../../CardView/components/Tag'

export type TagCount = { tag: CardCategory; count: number }

type Props = {
	tags: TagCount[]
	open: boolean
}

export const HoverTags = ({ tags, open }: Props) => {
	const [opened, setOpened] = useState(open)
	const [closing, setClosing] = useState(false)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		if (!open && !closing) {
			setClosing(true)

			setTimeout(() => {
				setMounted(false)
				setClosing(false)
				setOpened(false)
			}, 200)
		} else {
			if (!closing) {
				setOpened(open)
				setTimeout(() => setMounted(true))
			}
		}
	}, [open])

	return opened ? (
		<Container
			style={{
				transform:
					closing || !mounted ? 'translate(0, 5rem)' : 'translate(0, 0)',
				opacity: closing || !mounted ? 0 : 1
			}}
		>
			{tags.map(t => (
				<Line key={t.tag}>
					<Count>{t.count}</Count>
					<div>
						<TagC tag={t.tag} />
					</div>
				</Line>
			))}
		</Container>
	) : null
}

const Container = styled.div`
	position: absolute;
	bottom: 100%;
	left: 0;
	min-width: 100%;

	background-color: ${({ theme }) => theme.colors.background};
	border: 0.2rem solid ${({ theme }) => theme.colors.border};

	transition: all 0.2s;
`

const Count = styled.div`
	font-size: 125%;
	margin-right: 0.5rem;
`

const Line = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: 0.5rem;
`

const TagC = styled(Tag)`
	&& > div {
		margin-left: 0;
		margin-top: 0;
		box-sizing: border-box;
	}
`
