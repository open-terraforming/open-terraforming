import background from '@/assets/stars.jpg'
import { ApiState } from '@/store/modules/api'
import { mainColors } from '@/styles'
import { GlobalStyle } from '@/styles/global'
import { useAppStore } from '@/utils/hooks'
import React from 'react'
import styled from 'styled-components'
import { Connect } from '../Connect/Connect'
import { Game } from '../Game/Game'
import { Main } from '../Main/Main'
import { ApiErrorMessage } from './components/ApiErrorMessage'

export const App = () => {
	const apiState = useAppStore(state => state.api.state)

	return (
		<AppContainer id="stars">
			<GlobalStyle />
			{apiState === ApiState.Ready && <Main />}
			{apiState !== ApiState.Ready && apiState !== ApiState.Joined && (
				<Connect />
			)}
			{apiState === ApiState.Joined && <Game />}

			<ApiErrorMessage />
		</AppContainer>
	)
}

const AppContainer = styled.div`
	display: flex;
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0px;
	left: 0px;
	overflow: auto;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: #000;
	color: ${mainColors.text};
	background-image: url('${background}');
`
