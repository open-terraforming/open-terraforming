import React from 'react'
import styled from 'styled-components'
import { Resource } from './Resource'
import { PlayerGameState } from '@shared/index'

export const Resources = ({ state }: { state: PlayerGameState }) => {
	return (
		<Container>
			<Resource
				name="Money"
				res="money"
				value={state?.money}
				production={state?.moneyProduction}
			/>
			<Resource
				name="Ore"
				res="ore"
				value={state?.ore}
				production={state?.oreProduction}
			/>
			<Resource
				name="Titan"
				res="titan"
				value={state?.titan}
				production={state?.titanProduction}
			/>
			<Resource
				name="Plants"
				res="plants"
				value={state?.plants}
				production={state?.plantsProduction}
			/>
			<Resource
				name="Energy"
				res="energy"
				value={state?.energy}
				production={state?.energyProduction}
			/>
			<Resource
				name="Heat"
				res="heat"
				value={state?.heat}
				production={state?.heatProduction}
			/>
		</Container>
	)
}

const Container = styled.div`
	display: flex;
	justify-content: flex-end;
	flex: 1;
`
