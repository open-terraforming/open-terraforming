import { useWindowEvent } from '@/utils/hooks'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { darken } from 'polished'
import React, { ReactNode, useCallback, useState } from 'react'
import ReactDOM from 'react-dom'
import styled, { css, keyframes, Keyframes } from 'styled-components'
import { Body, Footer, Header } from './styles'
import { media } from '@/styles/media'

type RenderCallback = (
	close: () => void,
	animate: (animation?: Keyframes) => void
) => React.ReactNode

export interface ModalProps {
	children: React.ReactNode | RenderCallback
	contentStyle?: React.CSSProperties
	headerStyle?: React.CSSProperties
	bodyStyle?: React.CSSProperties
	footerStyle?: React.CSSProperties
	header?: React.ReactNode | RenderCallback
	footer?: React.ReactNode | RenderCallback
	open?: boolean
	onClose?: () => void
	disablePortal?: boolean
	allowClose?: boolean
	stretchFooterButtons?: boolean
	hideClose?: boolean
	closeIcon?: ReactNode
}

let modalPortal: HTMLDivElement | null = null

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
	allowClose = true,
	hideClose = false,
	closeIcon
}: ModalProps) => {
	const [isClosing, setIsClosing] = useState(false)

	const [closingAnimation, setClosingAnimation] = useState(
		undefined as Keyframes | undefined
	)

	const stopEvent = useCallback((e: React.MouseEvent) => {
		e.stopPropagation()
		e.nativeEvent.stopImmediatePropagation()
	}, [])

	const handleTameClose = () => handleClose()

	const handleClose = (animation?: Keyframes) => {
		if (!isClosing) {
			setClosingAnimation(animation)
			setIsClosing(true)

			setTimeout(() => {
				onClose && onClose()
			}, 150)
		}
	}

	useWindowEvent('keyup', (e: KeyboardEvent) => {
		if (allowClose && open && onClose && e.key === 'Escape') {
			onClose()
		}
	})

	const popup = (
		<>
			{open && (
				<PopupBackground
					onClick={allowClose ? handleTameClose : undefined}
					closing={isClosing}
				>
					<Popup
						style={contentStyle}
						closing={isClosing}
						closeAnimation={closingAnimation}
					>
						<Dialog role="dialog" onClick={stopEvent}>
							{header && (
								<Header style={headerStyle}>
									{typeof header === 'function'
										? header(handleTameClose, handleClose)
										: header}
									{!hideClose && allowClose && (
										<Close onClick={handleTameClose}>
											{closeIcon ?? <FontAwesomeIcon icon={faTimes} />}
										</Close>
									)}
								</Header>
							)}
							<Body style={bodyStyle} hasHeader={!!header} hasFooter={!!footer}>
								{typeof children === 'function'
									? children(handleTameClose, handleClose)
									: children}
							</Body>
							{footer && (
								<Footer
									style={footerStyle}
									stretchFooterButtons={stretchFooterButtons}
								>
									{typeof footer === 'function'
										? footer(handleTameClose, handleClose)
										: footer}
								</Footer>
							)}
						</Dialog>
					</Popup>
				</PopupBackground>
			)}
		</>
	)

	if (disablePortal) {
		return popup
	} else {
		if (!modalPortal) {
			modalPortal = document.createElement('div')
			modalPortal.id = 'app-modals'
			document.body.appendChild(modalPortal)
		}

		return ReactDOM.createPortal(popup, modalPortal)
	}
}

const bgIn = keyframes`
	0% { opacity: 0 }
	100% { opacity: 1; }
`

const bgOut = keyframes`
	0% { opacity: 1 }
	100% { opacity: 0; }
`

const Close = styled.div`
	margin-left: auto;
	cursor: pointer;
`

const PopupBackground = styled.div<{ closing?: boolean }>`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	z-index: 999;
	align-items: flex-start;

	${props =>
		props.closing
			? css`
					animation-name: ${bgOut};
					animation-duration: 150ms;
					animation-timing-function: ease-in;
					animation-fill-mode: forwards;
			  `
			: css`
					animation-name: ${bgIn};
					animation-duration: 150ms;
					animation-timing-function: ease-out;
			  `}
`

const popIn = keyframes`
	0% { transform: scale(0.8); opacity: 0; }
	75% { opacity: 1; }
	100% { transform: scale(1); }
`

const popOut = keyframes`
	0% { transform: perspective(400px) scale(1); opacity: 1 }
	100% { transform: perspective(400px) rotate3d(1, 0, 0, -70deg) scale(0.5); opacity: 0; }
`

const Popup = styled.div<{ closing?: boolean; closeAnimation?: Keyframes }>`
	position: relative;
	margin: 5% auto 5% auto;
	border: 2px solid ${({ theme }) => theme.colors.border};
	padding: 0px;
	border-radius: 0px;

	${({
		theme: {
			colors: { modalBackground: background }
		}
	}) => css`
		background-color: ${background};
		background: linear-gradient(
			45deg,
			${darken(0.01, background)} 25%,
			${background} 25%,
			${background} 50%,
			${darken(0.01, background)} 50%,
			${darken(0.01, background)} 75%,
			${background} 75%,
			${background}
		);
	`}
	background-size: 40px 40px;

	min-width: 200px;
	max-width: 80%;
	max-height: 80%;
	overflow: auto;
	display: flex;
	flex-direction: column;

	${media.medium} {
		max-width: 100%;
		max-height: 100%;
		margin-top: 0;
		margin-bottom: 0;
	}

	${props =>
		props.closing
			? css`
					animation-name: ${props.closeAnimation || popOut};
					animation-duration: 150ms;
					animation-timing-function: ease-out;
					animation-fill-mode: forwards;
			  `
			: css`
					animation-name: ${popIn};
					animation-duration: 150ms;
					animation-timing-function: ease-out;
			  `}
`

const Dialog = styled.div`
	overflow: auto;
	display: flex;
	flex-direction: column;
	min-height: 0;
	max-height: 100%;
`
