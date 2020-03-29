import React from 'react'
import styled from 'styled-components'
import { Resource } from './Resource'
import { PlayerGameState } from '@shared/index'

export const Resources = ({ state }: { state: PlayerGameState }) => {
	return (
		<Container>
			<Resource
				name="Money"
				value={state?.money}
				production={state?.moneyProduction}
			/>
			<Resource
				name="Ore"
				value={state?.ore}
				production={state?.oreProduction}
			/>
			<Resource
				name="Titan"
				value={state?.titan}
				production={state?.titanProduction}
			/>
			<Resource
				name="Plants"
				value={state?.plants}
				production={state?.plantsProduction}
			/>
			<Resource
				name="Energy"
				value={state?.energy}
				production={state?.energyProduction}
			/>
			<Resource
				name="Heat"
				value={state?.heat}
				production={state?.heatProduction}
			/>
		</Container>
	)
}

const Container = styled.div`
	display: flex;
	align-items: center;
`
