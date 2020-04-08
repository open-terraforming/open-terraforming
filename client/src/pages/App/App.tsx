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

export const App = () => {
	const dispatch = useAppDispatch()
	const initialized = useAppStore(state => state.client.initialized)
	const connected = useAppStore(state => state.api.connected)

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
			{(!initialized || !connected) && <Connect />}
			{initialized && connected && <Game />}

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
