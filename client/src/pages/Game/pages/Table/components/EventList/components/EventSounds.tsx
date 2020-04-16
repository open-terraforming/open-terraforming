import React, { useState, useEffect } from 'react'
import { GameEvent, EventType } from '../types'
import { Sounds } from '@/sounds/sounds'
import { GridCellContent } from '@shared/index'

type Props = {
	events: GameEvent[]
}

export const EventSounds = ({ events }: Props) => {
	const [processed, setProcessed] = useState(0)

	useEffect(() => {
		if (events.length > processed) {
			const toPlay = events
				.slice(processed)
				.map(e => {
					switch (e.type) {
						case EventType.NewGeneration:
							return Sounds.nextGeneration
						case EventType.PlayingChanged:
							return Sounds.playerChanged

						case EventType.TilePlaced:
							switch (e.tile) {
								case GridCellContent.Ocean:
									return Sounds.oceanPlaced
								case GridCellContent.Forest:
									return Sounds.greeneryPlaced
								case GridCellContent.City:
									return Sounds.cityPlaced
								case GridCellContent.Other:
									return Sounds.otherPlaced
							}
					}
				})
				.find(e => !!e)

			if (toPlay) {
				toPlay.play()
			}

			setProcessed(events.length)
		}
	}, [events])

	return <></>
}
