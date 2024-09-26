import { useElementEvent, useWindowEvent } from '@/utils/hooks'
import { rgba } from 'polished'
import { ReactNode, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { Portal } from '../Portal/Portal'

export type PopoutPosition =
	| 'top-left'
	| 'bottom-left'
	| 'bottom-right'
	| 'bottom-center'

interface Props {
	trigger: HTMLElement | null
	content?: ReactNode
	disableStyle?: boolean
	position?: PopoutPosition
	className?: string
	sticky?: boolean
	stickyTimeout?: number
	openDelay?: number
}

export const usePopout = ({
	trigger,
	position = 'top-left',
	disableStyle,
	content,
	className,
	sticky,
	stickyTimeout = 200,
	openDelay = 0,
}: Props) => {
	const [triggerHovered, setTriggerHovered] = useState(false)
	const [contentHovered, setContentHovered] = useState(false)

	const showTimeoutRef = useRef<ReturnType<typeof setTimeout>>()
	const stickyTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

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

				case 'bottom-center': {
					left = rect.left + rect.width / 2 - contentRect.width / 2
					top = rect.bottom + 5
					caretOffset = contentRect.width / 2
					break
				}
			}

			maxHeight = viewHeight - top - 30

			setCalculatedPosition({ left, top, maxHeight, caretOffset })
		}
	}

	useEffect(() => {
		recalculate()
	}, [triggerHovered])

	useElementEvent(trigger, 'mouseover', () => {
		if (stickyTimeoutRef.current) {
			clearTimeout(stickyTimeoutRef.current)
			stickyTimeoutRef.current = undefined
		}

		if (openDelay === 0) {
			setTriggerHovered(true)
		} else {
			if (!showTimeoutRef.current) {
				showTimeoutRef.current = setTimeout(() => {
					setTriggerHovered(true)
					showTimeoutRef.current = undefined
				}, openDelay)
			}
		}
	})

	useElementEvent(trigger, 'mouseleave', () => {
		if (showTimeoutRef.current) {
			clearTimeout(showTimeoutRef.current)
			showTimeoutRef.current = undefined
		}

		if (!sticky) {
			setTriggerHovered(false)

			return
		}

		if (stickyTimeoutRef.current) {
			clearTimeout(stickyTimeoutRef.current)
			stickyTimeoutRef.current = undefined
		}

		stickyTimeoutRef.current = setTimeout(
			() => setTriggerHovered(false),
			stickyTimeout,
		)
	})

	useWindowEvent('resize', () => recalculate())
	useWindowEvent('scroll', () => recalculate(), true)

	return (
		<>
			{(triggerHovered || (sticky && contentHovered)) && content && (
				<Portal>
					<Container
						onMouseEnter={() => setContentHovered(true)}
						onMouseLeave={() => setContentHovered(false)}
						className={className}
						ref={contentRef}
						disableStyle={disableStyle}
						style={{
							top: calculatedPosition.top,
							left: calculatedPosition.left,
							maxHeight: calculatedPosition.maxHeight,
						}}
					>
						{(position === 'bottom-left' ||
							position === 'bottom-right' ||
							position === 'bottom-center') && (
							<BottomCaret style={{ left: calculatedPosition.caretOffset }} />
						)}
						{position === 'top-left' && (
							<TopCaret style={{ left: calculatedPosition.caretOffset }} />
						)}
						<Inner>{content}</Inner>
					</Container>
				</Portal>
			)}
		</>
	)
}

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
			border: 2px solid ${({ theme }) => rgba(theme.colors.border, 1)};
		`}
`

const Inner = styled.div<{ disableStyle?: boolean }>`
	position: relative;
	overflow: auto;

	${(props) =>
		!props.disableStyle &&
		css`
			padding: 10px;
		`}
`
