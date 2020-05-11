/* eslint-disable @typescript-eslint/no-explicit-any */
import { createStore, applyMiddleware, DeepPartial } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import reduxThunk from 'redux-thunk'

import reducers from './modules'

export type StoreState = ReturnType<typeof reducers>

const middleWares = [reduxThunk]

if (process.env.NODE_ENV === 'development') {
	middleWares.push(
		require('redux-logger').createLogger({
			collapsed: true,
		}) as any
	)
}

export const buildStore = (initialState: DeepPartial<StoreState> = {}) =>
	createStore(
		reducers,
		initialState as any,
		composeWithDevTools({ trace: true })(applyMiddleware(...middleWares))
	)
