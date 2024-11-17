import { ClippedBox } from '@/components/ClippedBox'
import { ClippedBoxTitle } from '@/components/ClippedBoxTitle'
import { Flex } from '@/components/Flex/Flex'
import { PlayerId } from '@shared/gameState'
import { ReactNode } from 'react'
import styled from 'styled-components'
import { DelegatesView } from './DelegatesView'

type Props = {
	title: ReactNode
	delegates: (PlayerId | null)[]
}

export const DelegatesBox = ({ title, delegates }: Props) => {
	return (
		<ClippedBox style={{ flex: 1 }}>
			<Title>{title}</Title>
			<Delegates>
				<DelegatesView delegates={delegates} />
			</Delegates>
		</ClippedBox>
	)
}

const Title = styled(ClippedBoxTitle)`
	padding: 0.25rem;
`

const Delegates = styled(Flex)`
	gap: 0.1rem;
	flex-wrap: wrap;
	padding: 0.25rem;
`
