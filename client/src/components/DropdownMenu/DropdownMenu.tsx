import React, { useEffect, useState, useCallback } from 'react'
import Popup from 'reactjs-popup'

type Props = {
	trigger: (isOpen: boolean) => JSX.Element
	onClose?: () => void
	contentStyle?: object
	overlayStyle?: object
	arrow?: boolean
	children: React.ReactNode
}

export const DropdownMenu = ({
	trigger,
	onClose,
	contentStyle,
	overlayStyle,
	arrow,
	children
}: Props) => {
	const [opened, setOpened] = useState(false)

	const handleClose = useCallback(() => {
		setOpened(false)
		onClose?.()
	}, [onClose])

	useEffect(() => {
		opened && document.addEventListener('click', handleClose, false)

		return () => document.removeEventListener('click', handleClose)
	}, [opened, handleClose])

	const handleDropdownClick = (e: React.MouseEvent) => {
		e.nativeEvent.stopImmediatePropagation()
	}

	return (
		<Popup
			trigger={trigger}
			open={opened}
			onOpen={() => setOpened(true)}
			position="bottom right"
			contentStyle={contentStyle}
			overlayStyle={overlayStyle}
			arrow={arrow}
			closeOnDocumentClick={true}
		>
			<div onClick={handleDropdownClick}>{children}</div>
		</Popup>
	)
}
