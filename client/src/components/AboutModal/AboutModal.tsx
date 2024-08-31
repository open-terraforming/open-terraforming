import { VERSION } from '@/constants'
import { Modal } from '../Modal/Modal'
import styled from 'styled-components'
import { BoxWithTitle } from '../BoxWithTitle/BoxWithTitle'
import { ReactNode } from 'react'
import { ExternalLink } from '../ExternalLink/ExternalLink'

type Props = {
	onClose: () => void
}

export const AboutModal = ({ onClose }: Props) => {
	return (
		<Modal
			header="Open Terraforming"
			open
			onClose={onClose}
			contentStyle={{ maxWidth: '450px' }}
		>
			<BoxWithTitle title="GENERAL INFO">
				<InfoLine title="Web">
					<ExternalLink href="https://open-terraforming.eu/">
						open-terraforming.eu
					</ExternalLink>
				</InfoLine>
				<InfoLine title="Github">
					<ExternalLink href="https://github.com/open-terraforming/open-terraforming">
						open-terraforming/open-terraforming
					</ExternalLink>
				</InfoLine>
				<InfoLine title="Version">{VERSION}</InfoLine>
			</BoxWithTitle>

			<BoxWithTitle title="CREDITS">
				<InfoLine title="Contributors">SkaceKamen + others</InfoLine>
				<InfoLine title="Graphics">
					<p>FREEPIK</p>
					<p>NASA</p>
					<p>FontAwesome</p>
				</InfoLine>
			</BoxWithTitle>
		</Modal>
	)
}

const InfoLine = ({
	title,
	children,
}: {
	title: ReactNode
	children: ReactNode
}) => {
	return (
		<InfoLineC>
			<InfoLineL>{title}</InfoLineL>
			<InfoLineV>{children}</InfoLineV>
		</InfoLineC>
	)
}

const InfoLineC = styled.div`
	margin: 0.5rem 0;
	text-align: center;
`

const InfoLineL = styled.div`
	margin-top: 0.75rem;
	margin-bottom: 0.25rem;
	font-size: 85%;
	opacity: 0.75;
`

const InfoLineV = styled.div``
