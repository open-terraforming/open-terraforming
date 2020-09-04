import React, { useMemo } from 'react'
import { Provider } from 'react-redux'
import { App } from './pages/App/App'
import { buildStore } from './store'
import { hot } from 'react-hot-loader/root'
import * as styles from '@/styles'
import { ThemeProvider } from 'styled-components'
import { ApiContextProvider } from './context/ApiContext'
import { EventsContextProvider } from './context/EventsContext'
import { LocaleContextProvider } from './context/LocaleContext'

const RootComponent = () => {
	const store = useMemo(() => buildStore(), [])

	return (
		<Provider store={store}>
			<LocaleContextProvider language={'en'}>
				<ApiContextProvider>
					<EventsContextProvider>
						<ThemeProvider theme={styles}>
							<App />
						</ThemeProvider>
					</EventsContextProvider>
				</ApiContextProvider>
			</LocaleContextProvider>
		</Provider>
	)
}

export const Root = hot(RootComponent)
