import { useEvents } from '@/context/EventsContext'
import { faMousePointer } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { RealtimeEvent, RealtimeEventType } from '@shared/events'
import { PlayerState } from '@shared/index'
import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { lighten } from 'polished'

type Props = {
	player: PlayerState
}

export const Mouse = ({ player }: Props) => {
	const events = useEvents()
	const onMove = useRef<(x: number, y: number) => void>()
	const container = useRef<HTMLDivElement>(null)
	const disappear = useRef<ReturnType<typeof setTimeout> | null>()

	onMove.current = (x: number, y: number) => {
		if (container.current) {
			container.current.style.opacity = '1'

			container.current.style.transform = `translate(${x * 100}vw, ${
				y * 100
			}vh)`

			if (disappear.current) {
				clearTimeout(disappear.current)
			}

			disappear.current = setTimeout(() => {
				if (container.current) {
					container.current.style.opacity = '0'
				}
			}, 3000)
		}
	}

	useEffect(() => {
		const handler = (e: RealtimeEvent) => {
			if (e.type === RealtimeEventType.MouseMove && e.playerId === player.id) {
				onMove.current?.(e.x, e.y)
			}
		}

		events?.onEvent.on(handler)

		return () => {
			events?.onEvent.off(handler)
		}
	}, [player.id, onMove, events])

	return player.connected ? (
		<E ref={container}>
			<FontAwesomeIcon
				icon={faMousePointer}
				color={lighten(0.3, player.color)}
			/>
		</E>
	) : (
		<></>
	)
}

const E = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	transform: translate(-100px, -100px);
	transition: opacity 0.1s;
`
