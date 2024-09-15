import { useElementEvent, useWindowEvent } from '@/utils/hooks'
import { rgba } from 'polished'
import { ReactNode, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { Portal } from '../Portal/Portal'

export type PopoutPosition = 'top-left' | 'bottom-left' | 'bottom-right'

interface Props {
	trigger: HTMLElement | null
	content?: ReactNode
	showOnHover?: boolean
	shown?: boolean
	disableStyle?: boolean
	position?: PopoutPosition
	className?: string
}

export const usePopout = ({
	trigger,
	showOnHover = true,
	shown = true,
	position = 'top-left',
	disableStyle,
	content,
	className,
}: Props) => {
	const [opened, setOpened] = useState(showOnHover ? false : shown)

	const [calculatedPosition, setCalculatedPosition] = useState({
		left: -1000 as number | undefined,
		top: -1000 as number | undefined,
		caretOffset: -15 as number | undefined,
		maxHeight: undefined as number | undefined,
	})

	const contentRef = useRef<HTMLDivElement>(null)

	const recalculate = () => {
		let top = undefined as number | undefined
		let left = undefined as number | undefined
		let maxHeight = undefined as number | undefined
		let caretOffset = undefined as number | undefined

		const viewHeight = Math.max(
			document.documentElement.clientHeight,
			window.innerHeight || 0,
		)

		if (trigger && contentRef.current) {
			const rect = trigger.getBoundingClientRect()
			const contentRect = contentRef.current?.getBoundingClientRect()

			switch (position) {
				case 'top-left': {
					left = rect.left
					top = rect.top - 5 - contentRect.height
					caretOffset = rect.width / 2 - 3
					break
				}

				case 'bottom-left': {
					left = rect.left
					top = rect.bottom + 5
					caretOffset = rect.width / 2
					break
				}

				case 'bottom-right': {
					left = rect.left + rect.width - contentRect.width
					top = rect.bottom + 5
					caretOffset = contentRect.width - rect.width / 2
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

	useElementEvent(trigger, 'mouseover', () => {
		setOpened(true)
	})

	useElementEvent(trigger, 'mouseleave', () => {
		setOpened(false)
	})

	useWindowEvent('resize', () => recalculate())
	useWindowEvent('scroll', () => recalculate(), true)

	console.log({ calculatedPosition })

	return (
		<>
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
						{(position === 'bottom-left' || position === 'bottom-right') && (
							<BottomCaret style={{ left: calculatedPosition.caretOffset }} />
						)}
						{position === 'top-left' && (
							<TopCaret style={{ left: calculatedPosition.caretOffset }} />
						)}
						{content}
					</Container>
				</Portal>
			)}
		</>
	)
}

/*
export const Popout = ({
	showOnHover = true,
	shown = true,
	position = 'top',
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
				case 'top': {
					left = rect.left
					top = rect.top - 5 - contentRect.height
					caretOffset = rect.width / 2 - 3
					break
				}

				case 'bottom': {
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
	*/

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
