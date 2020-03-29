import React, { useCallback } from 'react'
import { Header, Footer, Body } from './styles'
import { Portal } from '../Portal/Portal'
import styled from 'styled-components'
import { useWindowEvent } from '@/utils/hooks'

export interface ModalProps {
	children: React.ReactNode | ((close: () => void) => React.ReactNode)
	contentStyle?: React.CSSProperties
	headerStyle?: React.CSSProperties
	bodyStyle?: React.CSSProperties
	footerStyle?: React.CSSProperties
	header?: React.ReactNode | ((close: () => void) => React.ReactNode)
	footer?: React.ReactNode | ((close: () => void) => React.ReactNode)
	open?: boolean
	onClose?: () => void
	disablePortal?: boolean
	closeOnEscape?: boolean
	stretchFooterButtons?: boolean
}

export const Modal = ({
	children,
	contentStyle,
	header,
	footer,
	open,
	onClose,
	disablePortal,
	headerStyle,
	footerStyle,
	bodyStyle,
	stretchFooterButtons = true,
	closeOnEscape = true
}: ModalProps) => {
	const stopEvent = useCallback((e: React.MouseEvent) => {
		e.nativeEvent.stopImmediatePropagation()
	}, [])

	useWindowEvent('keyup', (e: KeyboardEvent) => {
		if (closeOnEscape && open && onClose && e.key === 'Escape') {
			onClose()
		}
	})

	const popup = (
		<>
			{open && (
				<PopupBackground>
					<Popup style={contentStyle}>
						<div role="dialog" onClick={stopEvent}>
							{header && (
								<Header style={headerStyle}>
									{typeof header === 'function'
										? header(onClose || (() => null))
										: header}
								</Header>
							)}
							<Body style={bodyStyle}>
								{typeof children === 'function'
									? children(onClose || (() => null))
									: children}
							</Body>
							{footer && (
								<Footer
									style={footerStyle}
									stretchFooterButtons={stretchFooterButtons}
								>
									{typeof footer === 'function'
										? footer(onClose || (() => null))
										: footer}
								</Footer>
							)}
						</div>
					</Popup>
				</PopupBackground>
			)}
		</>
	)

	if (disablePortal) {
		return popup
	} else {
		return <Portal>{popup}</Portal>
	}
}

const PopupBackground = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	z-index: 999;
	color: #fff;
`

const Popup = styled.div`
	position: relative;
	background: rgba(14, 129, 214, 0.8);
	width: 400px;
	margin: auto;
	border: 1px solid rgba(14, 129, 214, 0.8);
	padding: 0px;
	border-radius: 0px;
`
