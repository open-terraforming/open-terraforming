import React, { useMemo } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { App } from './pages/App/App'
import { buildStore } from './store'
import { hot } from 'react-hot-loader/root'
import * as styles from '@/styles'
import { ThemeProvider } from 'styled-components'
import { ApiContextProvider } from './context/ApiContext'

const RootComponent = () => {
	const store = useMemo(() => buildStore(), [])

	return (
		<Provider store={store}>
			<ApiContextProvider>
				<ThemeProvider theme={styles}>
					<BrowserRouter>
						<App />
					</BrowserRouter>
				</ThemeProvider>
			</ApiContextProvider>
		</Provider>
	)
}

export const Root = hot(RootComponent)
