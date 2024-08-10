/* eslint-disable @typescript-eslint/no-explicit-any */
import { createStore, applyMiddleware } from 'redux'
import { thunk } from 'redux-thunk'
import * as reduxLogger from 'redux-logger'

import reducers from './modules'

export type StoreState = ReturnType<typeof reducers>

type DeepPartial<T> = T extends object
	? {
			[P in keyof T]?: DeepPartial<T[P]>
	  }
	: T

const middleWares = [thunk]

if (process.env.NODE_ENV === 'development') {
	middleWares.push(
		reduxLogger.createLogger({
			collapsed: true
		}) as any
	)
}

export const buildStore = (initialState: DeepPartial<StoreState> = {}) =>
	createStore(reducers, initialState as any, applyMiddleware(...middleWares))
