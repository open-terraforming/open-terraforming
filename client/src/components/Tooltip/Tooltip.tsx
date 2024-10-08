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

/** @TODO: Use usePopout */
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
		caretOffset: -15 as number | undefined,
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
		let caretOffset = undefined as number | undefined

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
					caretOffset = rect.width / 2 - 3
					break
				}

				case Position.Left: {
					left = rect.left - contentRect.width - 15
					top = rect.top - 15
					caretOffset = rect.height / 2
					break
				}

				case Position.BottomLeft: {
					left = rect.right - contentRect.width
					top = rect.bottom
					caretOffset = rect.width / 2
					break
				}

				case Position.Bottom: {
					left = rect.left
					top = rect.bottom + 5
					caretOffset = rect.width / 2
					break
				}
			}

			maxHeight = viewHeight - top - 15

			setCalculatedPosition({ left, top, maxHeight, caretOffset })
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

			{(opened || (shown && !showOnHover)) && content && (
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
						{position === Position.Bottom && (
							<BottomCaret style={{ left: calculatedPosition.caretOffset }} />
						)}
						{position === Position.Top && (
							<TopCaret style={{ left: calculatedPosition.caretOffset }} />
						)}
						{content}
					</Container>
				</Portal>
			)}
		</>
	)
}

const Trigger = styled.span``

const Caret = styled.div`
	content: ' ';
	position: absolute;
`

const TopCaret = styled(Caret)`
	bottom: -14px;
	margin-left: -5px;
	border: 7px solid transparent;
	border-top-color: ${({ theme }) => rgba(theme.colors.border, 1)};
`

const BottomCaret = styled(Caret)`
	top: -14px;
	margin-left: -5px;
	border: 7px solid transparent;
	border-bottom-color: ${({ theme }) => rgba(theme.colors.border, 1)};
`

const Container = styled.div<{ disableStyle?: boolean }>`
	position: absolute;
	z-index: 999999;

	${(props) =>
		!props.disableStyle &&
		css`
			background: ${rgba(props.theme.colors.background, 1)};
			color: #ddd;
			padding: 10px;
			border: 2px solid ${({ theme }) => rgba(theme.colors.border, 1)};
		`}
`
