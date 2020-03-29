/* eslint-disable @typescript-eslint/no-explicit-any */
import { combineReducers } from 'redux'

import api from './api'
import client from './client'
import game from './game'
import table from './table'

const reducers = combineReducers({
	api,
	client,
	game,
	table
})

export default (state: any, action: any) => {
	return reducers(state, action)
}
