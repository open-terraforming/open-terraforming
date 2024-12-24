import background from '@/assets/stars.jpg'
import { ApiState, setApiState } from '@/store/modules/api'
import { loadSettings } from '@/store/modules/settings'
import { GlobalStyle } from '@/styles/global'
import { useAppDispatch, useAppStore, useWindowEvent } from '@/utils/hooks'
import { useEffect, useMemo } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { Connect } from '../Connect/Connect'
import { Game } from '../Game/Game'
import { Main } from '../Main/Main'
import { ApiErrorMessage } from './components/ApiErrorMessage'
import { defaultTheme } from '@/themes/defaultTheme'
import { greenTheme } from '@/themes/greenTheme'
import { redTheme } from '@/themes/redTheme'
import { SoundController } from './components/SoundController'
import { SessionController } from './components/SessionController'

const THEME_MAP = {
	default: defaultTheme,
	green: greenTheme,
	red: redTheme,
}

export const App = () => {
	const apiState = useAppStore((state) => state.api.state)
	const reconnecting = useAppStore((state) => state.api.reconnecting)
	const gameId = useAppStore((state) => state.api.gameId)
	const dispatch = useAppDispatch()
	const theme = useAppStore((state) => state.settings.data.theme)

	const enableAnimations = useAppStore(
		(state) => state.settings.data.enableAnimations,
	)

	const themeData = useMemo(() => {
		const themeValues = (theme && THEME_MAP[theme]) || defaultTheme

		return {
			...themeValues,
			animations: {
				...themeValues.animations,
				enabled: enableAnimations,
			},
		}
	}, [theme, enableAnimations])

	// Load settings from localStorage
	useEffect(() => {
		dispatch(loadSettings())
	}, [])

	// Change game id when navigation happens
	useWindowEvent('hashchange', () => {
		const parsedGameId = location.hash.substring(1).trim()

		if (parsedGameId !== gameId) {
			dispatch(
				setApiState({
					state: ApiState.Ready,
					gameId: parsedGameId || undefined,
				}),
			)
		}
	})

	console.log({ apiState: ApiState[apiState], reconnecting })

	return (
		<ThemeProvider theme={themeData}>
			<AppContainer id="stars">
				<GlobalStyle />
				{apiState === ApiState.Ready && <Main />}
				{apiState !== ApiState.Ready && apiState !== ApiState.Joined && (
					<Connect />
				)}
				{(apiState === ApiState.Joined ||
					(apiState === ApiState.Connected && reconnecting)) && <Game />}

				<ApiErrorMessage />
				<SoundController />
				<SessionController />
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
