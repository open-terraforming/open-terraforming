import background from '@/assets/stars.jpg'
import { ApiState } from '@/store/modules/api'
import { loadSettings } from '@/store/modules/settings'
import { GlobalStyle } from '@/styles/global'
import { useAppDispatch, useAppStore } from '@/utils/hooks'
import { useEffect, useMemo } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { Connect } from '../Connect/Connect'
import { Game } from '../Game/Game'
import { Main } from '../Main/Main'
import { ApiErrorMessage } from './components/ApiErrorMessage'
import { defaultTheme } from '@/themes/defaultTheme'
import { greenTheme } from '@/themes/greenTheme'
import { redTheme } from '@/themes/redTheme'

export const App = () => {
	const apiState = useAppStore((state) => state.api.state)
	const dispatch = useAppDispatch()
	const theme = useAppStore((state) => state.settings.data.theme)

	const themeData = useMemo(() => {
		switch (theme) {
			case 'green':
				return greenTheme
			case 'red':
				return redTheme
			default:
				return defaultTheme
		}
	}, [theme])

	// Load settings from localStorage
	useEffect(() => {
		dispatch(loadSettings())
	}, [])

	return (
		<ThemeProvider theme={themeData}>
			<AppContainer id="stars">
				<GlobalStyle />
				{apiState === ApiState.Ready && <Main />}
				{apiState !== ApiState.Ready && apiState !== ApiState.Joined && (
					<Connect />
				)}
				{apiState === ApiState.Joined && <Game />}

				<ApiErrorMessage />
			</AppContainer>
		</ThemeProvider>
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
	color: ${({ theme }) => theme.colors.text};
	background-image: url('${background}');
`
