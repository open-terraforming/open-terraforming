import React, { useMemo } from 'react'
import styled from 'styled-components'
import { rgba } from 'polished'
import { colors } from '@/styles'
import { PlayerAction, PlayerActionType } from '@shared/player-actions'
import { otherToStr, tileToStr } from '@shared/texts'

type Props = {
	pending: PlayerAction
}

export const PendingDisplay = ({ pending }: Props) => {
	const text = useMemo(() => {
		switch (pending.type) {
			case PlayerActionType.PickCorporation:
				return 'Picking corporation'
			case PlayerActionType.PickCards:
				return 'Picking cards'
			case PlayerActionType.PickPreludes:
				return 'Picking preludes'
			case PlayerActionType.PlaceTile:
				return (
					'Placing ' +
					(pending.state.other
						? otherToStr(pending.state.other)
						: tileToStr(pending.state.type))
				)
			case PlayerActionType.ClaimTile:
				return 'Selecting tile to claim'
			case PlayerActionType.PlayCard:
				return 'Playing card'
			case PlayerActionType.SponsorCompetition:
				return 'Selecting competition'
		}
	}, [pending])

	return (
		<Fade>
			<div>{text}</div>
		</Fade>
	)
}

const Fade = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: ${rgba(colors.background, 0.5)};
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 125%;
	font-weight: bold;
	color: #fff;
	z-index: 5;
`
