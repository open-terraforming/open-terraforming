import React from 'react'
import { useAppStore } from '@/utils/hooks'
import { Mouse } from './components/Mouse'
import { Portal } from '@/components'
import styled from 'styled-components'

type Props = {}

export const Mouses = ({}: Props) => {
	const players = useAppStore(state => state.game.state?.players) || []

	return (
		<Portal>
			<E>
				{players.map(p => (
					<Mouse key={p.id} player={p} />
				))}
			</E>
		</Portal>
	)
}

const E = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	z-index: 10;
	overflow: visible;
`
