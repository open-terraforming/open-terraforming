import React, { useState, useEffect, useCallback, HTMLProps } from 'react'
import { Portal } from '../Portal/Portal'

type Props = {
	className?: string
	children: React.ReactNode
	portal?: boolean
	menu: (opened: boolean, x: number, y: number) => React.ReactNode
} & HTMLProps<HTMLDivElement>

export const ContextMenuWrapper = ({
	children,
	menu,
	portal,
	className,
	...htmlProps
}: Props) => {
	const [opened, setOpened] = useState(false)
	const [x, setX] = useState(0)
	const [y, setY] = useState(0)

	const handleContextMenu = useCallback((e: React.MouseEvent) => {
		e.stopPropagation()
		e.preventDefault()

		setOpened(true)
		setX(e.pageX)
		setY(e.pageY)
	}, [])

	const handleClose = () => {
		setOpened(false)
	}

	useEffect(() => {
		document.addEventListener('click', handleClose, false)
		document.addEventListener('contextmenu', handleClose, true)

		return () => {
			document.removeEventListener('click', handleClose)
			document.removeEventListener('contextmenu', handleClose)
		}
	}, [])

	return (
		<>
			<div
				onContextMenu={handleContextMenu}
				className={`context-menu-wrapper ${className || ''}`}
				{...htmlProps}
			>
				{children}
			</div>
			{portal ? <Portal>{menu(opened, x, y)}</Portal> : menu(opened, x, y)}
		</>
	)
}
