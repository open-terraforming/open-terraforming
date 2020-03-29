import React, { useState } from 'react'
import { Modal } from '../Modal/Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faExclamationTriangle,
	faInfoCircle,
	faExclamationCircle,
	faCheck,
} from '@fortawesome/free-solid-svg-icons'
import Button from '../Button/Button'
import styled, { css } from 'styled-components'

type MessageModalType = 'info' | 'warn' | 'error'

const typeToIcon = {
	info: faInfoCircle,
	warn: faExclamationTriangle,
	error: faExclamationCircle,
	success: faCheck,
} as const

export const MessageModal = ({
	title,
	type,
	message,
	opened,
	onClose,
}: {
	title: string
	type: MessageModalType
	message: string
	opened?: boolean
	onClose?: () => void
}) => {
	const [open, setOpen] = useState(true)
	const handleClose = () => setOpen(false)

	return (
		<Modal
			header={
				<Header type={type}>
					<FontAwesomeIcon icon={typeToIcon[type]} />
					<span>{title}</span>
				</Header>
			}
			headerStyle={{ padding: 0, border: '0' }}
			footer={
				<Button onClick={onClose ?? handleClose} schema="primary">
					OK
				</Button>
			}
			open={opened ?? open}
			onClose={onClose ?? handleClose}
			contentStyle={{ width: 400, border: '0' }}
		>
			{message}
		</Modal>
	)
}

const Header = styled.div<{ type: MessageModalType }>`
	font-size: 14px;
	text-align: left;
	display: flex;
	align-items: center;
	padding: 20px;
	${(props) => css`
		background: ${props.theme.colors.message[props.type].background};
		color: ${props.theme.colors.message[props.type].color};
	`}

	> span {
		margin-left: 10px;
	}
`
