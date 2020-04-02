import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { useAppStore } from '@/utils/hooks'
import { CenteredText } from './CenteredText'

type Props = {
	onDone: () => void
	playing: number
}

export const PlayingChanged = ({ onDone, playing }: Props) => {
	const playerId = useAppStore(state => state.game.playerId)
	const game = useAppStore(state => state.game.state)
	const playingPlayer = game?.players[playing]
	const yourTurn = playingPlayer?.id === playerId

	return playingPlayer ? (
		<CenteredText
			onDone={onDone}
			color={yourTurn ? '#DBDB00' : '#4267B2'}
			textColor={yourTurn ? '#000' : '#fff'}
		>
			{yourTurn ? 'Your turn' : `${playingPlayer.name} is playing now`}
		</CenteredText>
	) : (
		<></>
	)
}
