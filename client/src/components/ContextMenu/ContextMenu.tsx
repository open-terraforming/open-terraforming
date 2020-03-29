import React, { useEffect, HTMLProps } from 'react'
import styled, { css } from 'styled-components'
import { Portal } from '../Portal/Portal'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = {
	opened: boolean
	x: number
	y: number
	onClose?: () => void
	children: React.ReactNode
}

export const ContextMenu = ({ opened, x, y, onClose, children }: Props) => {
	useEffect(() => {
		if (onClose) {
			document.addEventListener('click', onClose, false)
			document.addEventListener('contextmenu', onClose, true)

			return () => {
				document.removeEventListener('click', onClose)
				document.removeEventListener('contextmenu', onClose)
			}
		}
	}, [onClose])

	return (
		<Portal>
			<Menu role="menu" opened={opened} mouseX={x} mouseY={y}>
				{children}
			</Menu>
		</Portal>
	)
}

const Menu = styled.div<{ opened: boolean; mouseX: number; mouseY: number }>`
	position: absolute;
	display: ${(props) => (props.opened ? 'initial' : 'none')};
	top: ${(props) => `${props.mouseY}px`};
	left: ${(props) => `${props.mouseX}px`};
`

export const ContextMenuItems = styled.div<{ minWidth?: number }>`
	background: #fff;
	box-shadow: 1px 1px 5px #999;
	${(props) =>
		props.minWidth &&
		css`
			min-width: ${props.minWidth}px;
		`}
`

export const ContextMenuItem = ({
	children,
	icon,
	color = 'gray',
	title,
	...htmlProps
}: {
	children?: React.ReactNode
	title?: string
	icon?: IconProp
	color?: string
} & Omit<HTMLProps<HTMLDivElement>, 'ref' | 'as'>) => {
	return (
		<ContextMenuItemCtn {...htmlProps}>
			{icon && (
				<ContextMenuIcon>
					<FontAwesomeIcon icon={icon} color={color} />
				</ContextMenuIcon>
			)}
			{title ? <span>{title}</span> : children}
		</ContextMenuItemCtn>
	)
}

export const ContextMenuItemCtn = styled.div`
	padding: 8px 10px;
	user-select: none;
	cursor: pointer;
	display: flex;
	align-items: center;

	:hover {
		background: #eee;
	}
`

export const ContextMenuIcon = styled.div`
	width: 24px;
`
