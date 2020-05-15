import { GameInfo } from '@shared/extra'
import { GameModes } from '@shared/modes'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Maps } from '@shared/maps'
import { Expansions } from '@shared/expansions'

type Props = {
	info: GameInfo
}

export const Info = ({ info }: Props) => {
	const expansions = useMemo(
		() =>
			info.expansions ? info.expansions.map(e => Expansions[e]?.name) : [],
		[info]
	)

	return (
		<E>
			<InfoLine>
				<InfoL>Mode:</InfoL>
				<InfoV>{GameModes[info.mode]?.name}</InfoV>
			</InfoLine>
			<InfoLine>
				<InfoL>Board:</InfoL>
				<InfoV>{Maps[info.map]?.name}</InfoV>
			</InfoLine>
			<InfoLine>
				<InfoL>Expansions:</InfoL>
				<InfoV>
					{expansions.length === 0 ? 'No expansions' : expansions.join(', ')}
				</InfoV>
			</InfoLine>
		</E>
	)
}

const E = styled.div`
	margin-left: 1.5rem;
	margin-bottom: 1rem;
	flex: 0.5;
`

const InfoLine = styled.div`
	margin-bottom: 0.5rem;
`

const InfoL = styled.div`
	opacity: 0.5;
`

const InfoV = styled.div``
