import { useWindowEvent } from '@/utils/hooks'
import { rgba } from 'polished'
import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { Portal } from '../Portal/Portal'

export enum Position {
	Top,
	Left,
	Bottom,
	BottomLeft,
}

interface Props {
	content?: ReactNode
	showOnHover?: boolean
	shown?: boolean
	disableStyle?: boolean
	position?: Position
	children?: ReactNode
	className?: string
	styleTrigger?: CSSProperties
}

export const Tooltip = ({
	showOnHover = true,
	shown = true,
	position = Position.Top,
	disableStyle,
	content,
	children,
	className,
	styleTrigger,
}: Props) => {
	const [opened, setOpened] = useState(showOnHover ? false : shown)

	const [calculatedPosition, setCalculatedPosition] = useState({
		left: -1000 as number | undefined,
		top: -1000 as number | undefined,
		maxHeight: undefined as number | undefined,
	})

	const triggerRef = useRef<HTMLDivElement>(null)
	const contentRef = useRef<HTMLDivElement>(null)

	const handleMouseEnter = () => {
		setOpened(true)
	}

	const handleMouseLeave = () => {
		setOpened(false)
	}

	const recalculate = () => {
		let top = undefined as number | undefined
		let left = undefined as number | undefined
		let maxHeight = undefined as number | undefined

		const viewHeight = Math.max(
			document.documentElement.clientHeight,
			window.innerHeight || 0,
		)

		if (triggerRef.current && contentRef.current) {
			const rect = triggerRef.current?.getBoundingClientRect()
			const contentRect = contentRef.current?.getBoundingClientRect()

			switch (position) {
				case Position.Top: {
					left = rect.left
					top = rect.top - 5 - contentRect.height
					break
				}

				case Position.Left: {
					left = rect.left - contentRect.width - 15
					top = rect.top - 15
					break
				}

				case Position.BottomLeft: {
					left = rect.right - contentRect.width
					top = rect.bottom
					break
				}

				case Position.Bottom: {
					left = rect.left
					top = rect.bottom + 5
					break
				}
			}

			maxHeight = viewHeight - top - 15

			setCalculatedPosition({ left, top, maxHeight })
		}
	}

	useEffect(() => {
		recalculate()
	}, [opened, shown])

	useWindowEvent('resize', () => recalculate())
	useWindowEvent('scroll', () => recalculate(), true)

	return (
		<>
			<Trigger
				onMouseEnter={showOnHover ? handleMouseEnter : undefined}
				onMouseLeave={showOnHover ? handleMouseLeave : undefined}
				ref={triggerRef}
				style={styleTrigger}
				className="tooltip-trigger"
			>
				{children}
			</Trigger>

			{(opened || (shown && !showOnHover)) && (
				<Portal>
					<Container
						className={className}
						ref={contentRef}
						disableStyle={disableStyle}
						style={{
							top: calculatedPosition.top,
							left: calculatedPosition.left,
							maxHeight: calculatedPosition.maxHeight,
						}}
					>
						{content}
					</Container>
				</Portal>
			)}
		</>
	)
}

const Trigger = styled.span``

const Container = styled.div<{ disableStyle?: boolean }>`
	position: absolute;
	z-index: 999999;

	${(props) =>
		!props.disableStyle &&
		css`
			background: ${rgba(props.theme.colors.background, 1)};
			color: #ddd;
			padding: 10px;

			&::before {
				content: ' ';
				position: absolute;
				bottom: -10px;
				left: 50%;
				margin-left: -5px;
				border: 5px solid transparent;
				border-top-color: ${props.theme.colors.background};
			}
		`}
`
