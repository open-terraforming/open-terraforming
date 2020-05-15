import React, { useState } from 'react'
import { useGameState, useInterval } from '@/utils/hooks'
import styled from 'styled-components'
import { colors } from '@/styles'

type Props = {}

export const TimeDisplay = ({}: Props) => {
	const game = useGameState()
	const [time, setTime] = useState('')

	useInterval(() => {
		const started = new Date(game.started)
		const ended = game.ended.length > 0 ? new Date(game.ended) : new Date()

		let result = ''
		const diff = Math.round((ended.getTime() - started.getTime()) / 1000)

		result +=
			Math.floor(diff / 3600)
				.toString()
				.padStart(2, '0') + ':'

		result +=
			Math.floor(diff / 60)
				.toString()
				.padStart(2, '0') + ':'

		result += (diff % 60).toString().padStart(2, '0')

		setTime(result)
	}, 1000)

	return <C>{time}</C>
}

const C = styled.div`
	background: ${colors.background};
	border: 0.2rem solid ${colors.border};
	padding: 0.3rem 0;
	margin-left: 0.2rem;
	width: 4.3rem;
	text-align: center;
`
