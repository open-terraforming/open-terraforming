import React, { useState, useCallback } from 'react'

interface Props {
	className?: string
	/** Dialog renderer callback */
	dialog: (onClose: () => void) => React.ReactNode
	/** Children renderer, callback can be used to use custom clickable element */
	children: React.ReactNode | ((onClick: () => void) => React.ReactNode)
}

/**
 * Create openable dialog without having to add new state prop.
 */
export const DialogWrapper = ({ dialog, children, className }: Props) => {
	const [opened, setOpened] = useState(false)

	const onClose = useCallback(() => {
		setOpened(false)
	}, [])

	const onOpen = useCallback(() => {
		setOpened(true)
	}, [])

	return (
		<>
			{typeof children !== 'function' && (
				<div className={className} onClick={onOpen}>
					{children}
				</div>
			)}
			{typeof children === 'function' && children(onOpen)}
			{opened && dialog(onClose)}
		</>
	)
}
