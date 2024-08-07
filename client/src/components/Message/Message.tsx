import React from 'react'
import styled, { css } from 'styled-components'
import {
	faInfoCircle,
	faExclamationTriangle,
	faExclamationCircle,
	faCheck
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export type MessageType = 'info' | 'warn' | 'error' | 'success'

type Props = {
	message: React.ReactNode
	type?: MessageType
	header?: React.ReactNode
	style?: React.CSSProperties
}

const typeToIcon = {
	info: faInfoCircle,
	warn: faExclamationTriangle,
	error: faExclamationCircle,
	success: faCheck
} as const

export const Message = ({ type = 'info', message, header, style }: Props) => {
	return (
		<MessageContainer style={style}>
			<MessageTitle type={type} header={!!header}>
				<Icon>
					<FontAwesomeIcon icon={typeToIcon[type]} />
				</Icon>
				<span>{header ? header : message}</span>
			</MessageTitle>
			{header && <HeaderMessage>{message}</HeaderMessage>}
		</MessageContainer>
	)
}

const MessageContainer = styled.div`
	margin: 5px 0px 15px 0px;

	ul li {
		list-style-type: disc;
		margin-left: 20px;
	}

	code {
		background: #f5f5f5;
		padding: 0 5px;
		border-radius: 2px;
	}
`

const MessageTitle = styled.div<{ type: MessageType; header: boolean }>`
	${props => css`
		display: flex;
		align-items: center;
		justify-content: center;
		background: ${props.theme.colors.message[props.type].background};
		color: ${props.theme.colors.message[props.type].color};
		border: ${props.theme.colors.message[props.type].border};

		span {
			flex-grow: 1;
			padding: 8px 8px 8px 0;
		}
	`}
`

const HeaderMessage = styled.div`
	padding: 8px;
`

const Icon = styled.div`
	padding: 10px;
`
