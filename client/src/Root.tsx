import isPropValid from '@emotion/is-prop-valid'
import { useCallback, useMemo } from 'react'
import { Provider } from 'react-redux'
import { StyleSheetManager } from 'styled-components'
import { ApiContextProvider } from './context/ApiContext'
import { EventsContextProvider } from './context/EventsContext'
import { LocaleContextProvider } from './context/LocaleContext'
import { App } from './pages/App/App'
import { buildStore } from './store'

const RootComponent = () => {
	const store = useMemo(() => buildStore(), [])

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const shouldForwardProp = useCallback((propName: string, target: any) => {
		return typeof target === 'string' ? isPropValid(propName) : true
	}, [])

	return (
		<StyleSheetManager shouldForwardProp={shouldForwardProp}>
			<Provider store={store}>
				<LocaleContextProvider language={'en'}>
					<ApiContextProvider>
						<EventsContextProvider>
							<App />
						</EventsContextProvider>
					</ApiContextProvider>
				</LocaleContextProvider>
			</Provider>
		</StyleSheetManager>
	)
}

export const Root = RootComponent
