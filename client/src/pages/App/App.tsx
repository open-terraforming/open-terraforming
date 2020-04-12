import React, { useEffect } from 'react'
import styled from 'styled-components'

import { GlobalStyle } from '@/styles/global'
import { ApiErrorMessage } from './components/ApiErrorMessage'
import { Connect } from '../Connect/Connect'
import { useAppStore, useAppDispatch } from '@/utils/hooks'
import { Game } from '../Game/Game'
import { setClientState } from '@/store/modules/client'
import background from '@/assets/stars.jpg'
import { mainColors } from '@/styles'
import { ApiState } from '@/store/modules/api'
import { Main } from '../Main/Main'

export const App = () => {
	const dispatch = useAppDispatch()
	const apiState = useAppStore(state => state.api.state)

	useEffect(() => {
		if (localStorage['session']) {
			dispatch(
				setClientState({
					session: localStorage['session']
				})
			)
		}
	}, [])

	return (
		<AppContainer>
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
